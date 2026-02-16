import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "EASY" as const,
    statement: `## Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to target.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Understanding the Problem

Let's break this down with an example:

**Example 1:**
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [3, 3], target = 6
Output: [0, 1]
\`\`\`

### Approach Hint

Think about using a **hash map** (or object in JavaScript) to store values you've seen. For each number, check if \`target - currentNumber\` exists in your map!

### Constraints

- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- Only one valid answer exists`,
    constraints: "2 <= nums.length <= 10000\n-1000000000 <= nums[i] <= 1000000000",
    tags: ["Array", "Hash Table"],
    testCases: [
      { input: "[2,7,11,15]\n9", output: "[0,1]", isSample: true },
      { input: "[3,2,4]\n6", output: "[1,2]", isSample: true },
      { input: "[3,3]\n6", output: "[0,1]", isSample: true },
      { input: "[1,5,3,7,2]\n10", output: "[1,2]", isSample: false },
      { input: "[9,5,8,2,1]\n7", output: "[3,4]", isSample: false },
    ],
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "EASY" as const,
    statement: `## Palindrome Number

Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

An integer is a **palindrome** when it reads the same forward and backward.

### Understanding the Problem

A palindrome number reads the same forwards and backwards. For example:
- \`121\` → reads as "121" forward and "121" backward ✓
- \`-121\` → reads as "-121" forward and "121-" backward ✗
- \`10\` → reads as "10" forward and "01" backward ✗

### Examples

**Example 1:**
\`\`\`
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.
\`\`\`

**Example 2:**
\`\`\`
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
\`\`\`

**Example 3:**
\`\`\`
Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
\`\`\`

### Approach Hint

Instead of reversing the entire number (which can cause overflow), try reversing only **half** of the number and compare!

### Constraints

- \`-2^31 <= x <= 2^31 - 1\`

### Follow-up

Could you solve it without converting the integer to a string?`,
    constraints: "-2147483648 <= x <= 2147483647",
    tags: ["Math"],
    testCases: [
      { input: "121", output: "true", isSample: true },
      { input: "-121", output: "false", isSample: true },
      { input: "10", output: "false", isSample: true },
      { input: "12321", output: "true", isSample: false },
      { input: "12345", output: "false", isSample: false },
    ],
  },
  {
    title: "Reverse Integer",
    slug: "reverse-integer",
    difficulty: "MEDIUM" as const,
    statement: `## Reverse Integer

Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. If reversing \`x\` causes the value to go outside the signed 32-bit integer range \`[-2^31, 2^31 - 1]\`, then return \`0\`.

### Understanding the Problem

When you reverse the digits of a number:
- \`123\` becomes \`321\`
- \`-123\` becomes \`-321\`
- \`120\` becomes \`21\`

But here's the tricky part: **overflow handling**!

If the reversed number is greater than \`2,147,483,647\` or less than \`-2,147,483,648\`, you must return \`0\`.

### Examples

**Example 1:**
\`\`\`
Input: x = 123
Output: 321
\`\`\`

**Example 2:**
\`\`\`
Input: x = -123
Output: -321
\`\`\`

**Example 3:**
\`\`\`
Input: x = 120
Output: 21
\`\`\`

**Example 4:**
\`\`\`
Input: x = 2147483647
Output: 0
Explanation: Reversing 2147483647 gives 7463847412, which overflows.
\`\`\`

### Approach Hint

Instead of converting to string (which is slow), use **mathematical operations**:
- Use \`% 10\` to get the last digit
- Use \`/ 10\` to remove the last digit
- Use \`* 10\` to shift digits left

**Critical**: Check for overflow **before** it happens! Before adding a new digit, check if \`current > 214748364\` or \`current < -214748364\`.

### Constraints

- \`-2^31 <= x <= 2^31 - 1\``,
    constraints: "-2147483648 <= x <= 2147483647",
    tags: ["Math"],
    testCases: [
      { input: "123", output: "321", isSample: true },
      { input: "-123", output: "-321", isSample: true },
      { input: "120", output: "21", isSample: true },
      { input: "2147483647", output: "0", isSample: false },
      { input: "-2147483648", output: "0", isSample: false },
      { input: "1534236469", output: "0", isSample: false },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating",
    difficulty: "MEDIUM" as const,
    statement: `## Longest Substring Without Repeating Characters

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

### Understanding the Problem

A **substring** is a contiguous sequence of characters within a string.

For example, in \`"abcabcbb"\`:
- \`"abc"\` is a substring without repeating characters
- \`"bca"\` is another
- But \`"abca"\` has repeating 'a'

We need the **longest** such substring.

### Examples

**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with length 3.
\`\`\`

**Example 2:**
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with length 1.
\`\`\`

**Example 3:**
\`\`\`
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with length 3. Notice that "pwke" is a subsequence and not a substring.
\`\`\`

### Approach Hint

Use the **sliding window** technique:

1. Use two pointers (left and right) to represent a window
2. Expand the window by moving right
3. When you encounter a duplicate, shrink from the left
4. Keep track of the maximum length

You can use a **HashSet** or **HashMap** to track characters in the current window.

### Why Sliding Window?

A naive approach would check all possible substrings - that's O(n²) or O(n³). Sliding window gives us O(n) time complexity!

### Constraints

- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces`,
    constraints: "0 <= s.length <= 50000",
    tags: ["Hash Table", "String", "Sliding Window"],
    testCases: [
      { input: '"abcabcbb"', output: "3", isSample: true },
      { input: '"bbbbb"', output: "1", isSample: true },
      { input: '"pwwkew"', output: "3", isSample: true },
      { input: '""', output: "0", isSample: false },
      { input: '"abcdefg"', output: "7", isSample: false },
      { input: '"dvdf"', output: "3", isSample: false },
    ],
  },
  {
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "HARD" as const,
    statement: `## Median of Two Sorted Arrays

Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.

### Understanding the Problem

The **median** is the middle value in an ordered list:
- For odd length: it's the middle element
- For even length: it's the average of the two middle elements

For example:
- \`[1, 2, 3]\` → median is \`2\`
- \`[1, 2, 3, 4]\` → median is \`(2 + 3) / 2 = 2.5\`

### Why This is Hard

We need to find the median by **partitioning both arrays** into two halves such that:
1. Total elements on left = Total elements on right (or differ by 1)
2. All elements on left ≤ All elements on right

And we must do this in **O(log)** time!

### Examples

**Example 1:**
\`\`\`
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
\`\`\`

**Example 2:**
\`\`\`
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
\`\`\`

### Approach Hint

This is a classic **binary search** problem on arrays!

The key insight is:
1. Binary search on the **smaller array**
2. Find the correct partition point
3. Use the partition to determine the median

### Visual Example

For \`nums1 = [1,3,8,9]\` and \`nums2 = [2,7,10,11]\`:

\`\`\`
Partition:     [1, 3 | 8, 9]
               [2, 7 | 10, 11]
               
Left part:  [1, 3, 2, 7]    (all <= right part: [8, 9, 10, 11]) ✓
\`\`\`

### Constraints

- \`nums1.length == m\`
- \`nums2.length == n\`
- \`0 <= m <= 1000\`
- \`0 <= n <= 1000\`
- \`1 <= m + n <= 2000\`
- \`-10^6 <= nums1[i], nums2[i] <= 10^6\`

### Follow-up

Can you solve it in O(log(min(m, n))) time?`,
    constraints: "1 <= nums1.length <= 1000\n1 <= nums2.length <= 1000\n-1000000 <= nums1[i], nums2[i] <= 1000000",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    testCases: [
      { input: "[1,3]\n[2]", output: "2", isSample: true },
      { input: "[1,2]\n[3,4]", output: "2.5", isSample: true },
      { input: "[1]\n[1]", output: "1", isSample: false },
      { input: "[1,2,3]\n[4,5,6]", output: "3.5", isSample: false },
      { input: "[1,3]\n[2,4]", output: "2.5", isSample: false },
    ],
  },
];

async function main() {
  console.log("Starting seed...");

  for (const problem of problems) {
    const { testCases, ...problemData } = problem;
    
    const created = await prisma.problem.upsert({
      where: { slug: problemData.slug },
      update: {
        ...problemData,
        testCases: {
          deleteMany: {},
          create: testCases,
        },
      },
      create: {
        ...problemData,
        testCases: {
          create: testCases,
        },
      },
    });

    console.log(`Created problem: ${created.title}`);
  }

  console.log("Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
