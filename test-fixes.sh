#!/bin/bash

# AuctionHub Testing Script
# Tests all critical bug fixes

echo "🧪 AuctionHub Critical Bug Fixes - Test Suite"
echo "=============================================="
echo ""

BASE_URL="http://localhost:5001/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Helper function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

echo "📊 Test 1: Backend Server is Running"
echo "--------------------------------------"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/auctionitem/allitems)
if [ "$RESPONSE" = "200" ]; then
    print_result 0 "Backend server is responding"
else
    print_result 1 "Backend server not responding (HTTP $RESPONSE)"
fi
echo ""

echo "📊 Test 2: Date Schema Verification"
echo "--------------------------------------"
echo "Testing if dates are stored as Date objects..."
# This requires checking MongoDB directly or creating an auction
echo -e "${YELLOW}ℹ INFO${NC}: Create an auction in the UI and verify startTime/endTime are Date objects in MongoDB"
echo ""

echo "📊 Test 3: Leaderboard API Optimization"
echo "--------------------------------------"
LEADERBOARD_RESPONSE=$(curl -s $BASE_URL/user/getleaderboard)
if echo "$LEADERBOARD_RESPONSE" | grep -q "success"; then
    ITEM_COUNT=$(echo "$LEADERBOARD_RESPONSE" | grep -o "userName" | wc -l | tr -d ' ')
    if [ "$ITEM_COUNT" -le 100 ]; then
        print_result 0 "Leaderboard returns max 100 users (returned: $ITEM_COUNT)"
    else
        print_result 1 "Leaderboard returns more than 100 users (returned: $ITEM_COUNT)"
    fi
else
    print_result 1 "Leaderboard API not responding correctly"
fi
echo ""

echo "📊 Test 4: Error Handling in Code Review"
echo "--------------------------------------"
# Check if the cron job error handling has been fixed
if grep -q "console.error(\"Error processing ended auction:\"" ../backend/automation/endedAuctionCron.js; then
    print_result 0 "Cron job error handling fixed (no 'next()' call)"
else
    print_result 1 "Cron job error handling not fixed"
fi
echo ""

echo "📊 Test 5: Schema Reference Fix"
echo "--------------------------------------"
# Check if userId references User instead of Bid
if grep -q 'ref: "User"' ../backend/models/auctionSchema.js | grep -A 2 "bids:"; then
    print_result 0 "Schema reference fixed (userId refs User)"
else
    print_result 1 "Schema reference not fixed (still refs Bid)"
fi
echo ""

echo "📊 Test 6: Optimistic Locking Implementation"
echo "--------------------------------------"
# Check if bidController uses optimistic locking
if grep -q "findOneAndUpdate" ../backend/controllers/bidController.js && grep -q "__v" ../backend/controllers/bidController.js; then
    print_result 0 "Optimistic locking implemented in bidController"
else
    print_result 1 "Optimistic locking not implemented"
fi
echo ""

echo ""
echo "=============================================="
echo "📊 Test Summary"
echo "=============================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

# Manual test instructions
echo -e "${YELLOW}📝 Manual Tests Required:${NC}"
echo ""
echo "1. 🕒 Date Handling Test:"
echo "   - Create an auction with end time in 2 minutes"
echo "   - Wait for the cron job to run (runs every minute)"
echo "   - Verify auction status changes to 'Ended'"
echo "   - Check if winner is declared and email is sent"
echo ""
echo "2. 🏁 Concurrent Bidding Test:"
echo "   - Open 3-5 browser tabs"
echo "   - Have different users place bids simultaneously"
echo "   - Verify highest bid always wins"
echo "   - Check all bids are recorded correctly"
echo ""
echo "3. 💥 Cron Error Resilience Test:"
echo "   - Set incorrect SMTP credentials in backend/config/config.env"
echo "   - Wait for an auction to end"
echo "   - Verify server doesn't crash when email fails"
echo "   - Check error is logged in console"
echo "   - Restore correct SMTP credentials"
echo ""
echo "4. 📈 Leaderboard Performance Test:"
echo "   - Add 100+ test users with moneySpent > 0"
echo "   - Visit /leaderboard page"
echo "   - Verify page loads quickly (< 1 second)"
echo "   - Check browser network tab for response size"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All automated tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}"
    exit 1
fi
