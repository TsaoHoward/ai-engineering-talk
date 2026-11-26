#!/usr/bin/env bash
# check-handout-deps.sh - Check dependencies for handout generation

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track missing dependencies
MISSING_CORE=0
MISSING_PACKAGES=0
MISSING_PLAYWRIGHT=0

# Resolve the Playwright installation from the project that invoked this
# checker.  Do not infer browser availability from a shared cache glob: a
# cache can contain Chromium builds for several incompatible Playwright
# revisions.
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PLAYWRIGHT_CLI="$PROJECT_ROOT/node_modules/.bin/playwright"

playwright_chromium_executable() {
    (cd "$PROJECT_ROOT" && node -e 'const { chromium } = require("playwright"); process.stdout.write(chromium.executablePath())')
}

playwright_chromium_launches() {
    (cd "$PROJECT_ROOT" && node -e '
      const { chromium } = require("playwright");
      const timer = setTimeout(() => process.exit(1), 15000);
      (async () => {
        const browser = await chromium.launch({ headless: true });
        await browser.close();
        clearTimeout(timer);
      })().catch(() => {
        clearTimeout(timer);
        process.exit(1);
      });
    ')
}

echo -e "${BLUE}Checking handout generation dependencies...${NC}"
echo ""

# Check 1: pdflatex (core dependency)
echo -n "Checking pdflatex... "
if command -v pdflatex &> /dev/null; then
    echo -e "${GREEN}✓ installed${NC}"
else
    echo -e "${RED}✗ not found${NC}"
    MISSING_CORE=1
fi

# Check 2: Playwright Chromium (optional - for PNG export)
echo -n "Checking playwright chromium... "
if [[ ! -x "$PLAYWRIGHT_CLI" ]]; then
    echo -e "${YELLOW}⚠ project Playwright not found${NC}"
    MISSING_PLAYWRIGHT=1
elif ! PLAYWRIGHT_VERSION=$("$PLAYWRIGHT_CLI" --version 2>/dev/null); then
    echo -e "${YELLOW}⚠ project Playwright CLI is not usable${NC}"
    MISSING_PLAYWRIGHT=1
elif ! PLAYWRIGHT_EXECUTABLE=$(playwright_chromium_executable 2>/dev/null); then
    echo -e "${YELLOW}⚠ unable to resolve Chromium from ${PLAYWRIGHT_VERSION}${NC}"
    MISSING_PLAYWRIGHT=1
elif [[ ! -x "$PLAYWRIGHT_EXECUTABLE" ]]; then
    echo -e "${YELLOW}⚠ Chromium executable not found: ${PLAYWRIGHT_EXECUTABLE}${NC}"
    MISSING_PLAYWRIGHT=1
elif ! playwright_chromium_launches >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Chromium exists but could not launch: ${PLAYWRIGHT_EXECUTABLE}${NC}"
    MISSING_PLAYWRIGHT=1
else
    echo -e "${GREEN}✓ installed and usable (${PLAYWRIGHT_VERSION})${NC}"
fi

# Check 3: LaTeX packages (optional - for rich formatting)
echo -n "Checking LaTeX package tcolorbox... "
if kpsewhich tcolorbox.sty &> /dev/null; then
    echo -e "${GREEN}✓ installed${NC}"
else
    echo -e "${YELLOW}⚠ not found${NC}"
    MISSING_PACKAGES=1
fi

echo -n "Checking LaTeX package enumitem... "
if kpsewhich enumitem.sty &> /dev/null; then
    echo -e "${GREEN}✓ installed${NC}"
else
    echo -e "${YELLOW}⚠ not found${NC}"
    MISSING_PACKAGES=1
fi

echo ""

# Handle missing dependencies
if [[ $MISSING_CORE -eq 1 ]]; then
    echo -e "${RED}✗ Core dependency missing: pdflatex${NC}"
    echo ""
    echo -e "${BLUE}pdflatex is required for handout generation.${NC}"
    echo ""
    echo "Installation instructions:"
    echo ""
    echo "  macOS:"
    echo "    brew install --cask mactex-no-gui"
    echo ""
    echo "  Ubuntu/Debian:"
    echo "    sudo apt-get install texlive-latex-base texlive-latex-extra"
    echo ""
    echo "  Fedora/RHEL:"
    echo "    sudo dnf install texlive-scheme-basic texlive-latex"
    echo ""
    exit 1
fi

# Offer to install Playwright Chromium
if [[ $MISSING_PLAYWRIGHT -eq 1 ]]; then
    echo -e "${YELLOW}Playwright Chromium is needed for exporting slides as PNG images.${NC}"
    echo ""
    read -p "Would you like to install it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Installing Playwright Chromium...${NC}"
        if [[ -x "$PLAYWRIGHT_CLI" ]] && "$PLAYWRIGHT_CLI" install chromium; then
            if PLAYWRIGHT_EXECUTABLE=$(playwright_chromium_executable 2>/dev/null) && \
               [[ -x "$PLAYWRIGHT_EXECUTABLE" ]] && \
               playwright_chromium_launches >/dev/null 2>&1; then
                echo -e "${GREEN}✓ Playwright Chromium installed and usable${NC}"
                MISSING_PLAYWRIGHT=0
            else
                echo -e "${RED}✗ Chromium was not usable after installation${NC}"
            fi
        else
            echo -e "${RED}✗ Installation failed${NC}"
            echo "Install the project's Playwright dependency first, then run: npx playwright install chromium"
        fi
    else
        echo -e "${YELLOW}Skipping Playwright installation. Handout will be text-only without slide images.${NC}"
    fi
    echo ""
fi

# Offer to install LaTeX packages
if [[ $MISSING_PACKAGES -eq 1 ]]; then
    echo -e "${YELLOW}LaTeX packages (tcolorbox, enumitem) provide enhanced formatting for handouts.${NC}"
    echo ""

    # Check if tlmgr is available (macOS with MacTeX)
    if command -v tlmgr &> /dev/null; then
        read -p "Would you like to install them now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}Installing LaTeX packages...${NC}"
            if sudo tlmgr install tcolorbox enumitem 2>&1; then
                echo -e "${GREEN}✓ LaTeX packages installed successfully${NC}"
                MISSING_PACKAGES=0
            else
                echo -e "${RED}✗ Installation failed${NC}"
                echo "You can install manually with: sudo tlmgr install tcolorbox enumitem"
            fi
        else
            echo -e "${YELLOW}Skipping package installation. Handout will use basic LaTeX formatting.${NC}"
        fi
    else
        echo "On Ubuntu/Debian, these packages are typically included in texlive-latex-extra:"
        echo "  sudo apt-get install texlive-latex-extra"
        echo ""
        echo -e "${YELLOW}Using basic LaTeX formatting for handout.${NC}"
    fi
    echo ""
fi

# Return appropriate exit code
if [[ $MISSING_CORE -eq 1 ]]; then
    exit 1
elif [[ $MISSING_PACKAGES -eq 1 ]]; then
    echo -e "${BLUE}Handout generation will use basic formatting (missing LaTeX packages).${NC}"
    exit 2
elif [[ $MISSING_PLAYWRIGHT -eq 1 ]]; then
    echo -e "${BLUE}Handout generation will be text-only (missing Playwright).${NC}"
    exit 3
else
    echo -e "${GREEN}✓ All dependencies available for full handout generation!${NC}"
    exit 0
fi
