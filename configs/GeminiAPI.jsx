const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            text: 'Here\'s a Python function that sorts a list of numbers in ascending order. Identify the time complexity of this function. Then optimize this function and explain why it is faster. Don\'t use Python\'s in-built sort() method.\n\n```python\ndef sort_list(list_to_sort):\n  """\n  This function sorts a list of numbers in ascending order using the bubble sort algorithm.\n\n  Args:\n    list_to_sort: A list of numbers to be sorted.\n\n  Returns:\n    A new list with the numbers sorted in ascending order.\n  """\n  # Create a copy of the list to avoid modifying the original\n  sorted_list = list_to_sort.copy()\n  n = len(sorted_list)\n\n  # Iterate through the list n-1 times\n  for i in range(n-1):\n    # Flag to track if any swaps were made in a pass\n    swapped = False\n    # Iterate through the unsorted portion of the list\n    for j in range(n-i-1):\n      # Compare adjacent elements and swap if necessary\n      if sorted_list[j] > sorted_list[j+1]:\n        sorted_list[j], sorted_list[j+1] = sorted_list[j+1], sorted_list[j]\n        swapped = True\n    # If no swaps were made, the list is already sorted\n    if not swapped:\n      break\n\n    # Return the sorted list\n    return sorted_list\n\n# Example usage\nmy_list = [1, 9, 5, 2, 1, 8, 6, 6, 3, 4, 10, 7]\nsorted_list = sort_list(my_list)\nprint(sorted_list)  # Output: [1, 1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10]\n```',
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "```python\ndef sort_list(list_to_sort):\n  \"\"\"\n  This function sorts a list of numbers in ascending order using the bubble sort algorithm.\n\n  Args:\n    list_to_sort: A list of numbers to be sorted.\n\n  Returns:\n    A new list with the numbers sorted in ascending order.\n  \"\"\"\n  # Create a copy of the list to avoid modifying the original\n  sorted_list = list_to_sort.copy()\n  n = len(sorted_list)\n\n  # Iterate through the list n-1 times\n  for i in range(n-1):\n    # Flag to track if any swaps were made in a pass\n    swapped = False\n    # Iterate through the unsorted portion of the list\n    for j in range(n-i-1):\n      # Compare adjacent elements and swap if necessary\n      if sorted_list[j] > sorted_list[j+1]:\n        sorted_list[j], sorted_list[j+1] = sorted_list[j+1], sorted_list[j]\n        swapped = True\n    # If no swaps were made, the list is already sorted\n    if not swapped:\n      break\n\n    # Return the sorted list\n    return sorted_list\n\n# Example usage\nmy_list = [1, 9, 5, 2, 1, 8, 6, 6, 3, 4, 10, 7]\nsorted_list = sort_list(my_list)\nprint(sorted_list)  # Output: [1, 1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10]\n```\n\n**Time Complexity Analysis:**\n\nThe provided function uses the **Bubble Sort** algorithm.  Bubble Sort has a time complexity of **O(n^2)** in the worst and average case, where 'n' is the number of elements in the list. \n\n* **Worst Case:** The worst case occurs when the list is sorted in reverse order. In this case, the outer loop will iterate 'n-1' times, and the inner loop will also iterate 'n-1' times in each pass of the outer loop. This leads to a total of (n-1)*(n-1) comparisons, which is approximately O(n^2).\n\n* **Best Case:** The best case occurs when the list is already sorted. In this case, the outer loop will iterate 'n-1' times, but the inner loop will exit immediately due to the `if not swapped` condition. Therefore, the time complexity in the best case is O(n). However, this is still considered O(n^2) because the dominant term is n^2, even though it might not execute the entire inner loop in all cases.\n\n**Optimized Function using Insertion Sort:**\n\n```python\ndef insertion_sort(list_to_sort):\n  \"\"\"\n  This function sorts a list of numbers in ascending order using the insertion sort algorithm.\n\n  Args:\n    list_to_sort: A list of numbers to be sorted.\n\n  Returns:\n    A new list with the numbers sorted in ascending order.\n  \"\"\"\n  # Create a copy of the list to avoid modifying the original\n  sorted_list = list_to_sort.copy()\n  n = len(sorted_list)\n\n  # Iterate through the list, starting from the second element\n  for i in range(1, n):\n    key = sorted_list[i]\n    j = i - 1\n    # Compare the current element (key) with the elements in the sorted portion\n    while j >= 0 and key < sorted_list[j]:\n      sorted_list[j + 1] = sorted_list[j]\n      j -= 1\n    # Insert the current element (key) at its correct position\n    sorted_list[j + 1] = key\n\n  return sorted_list\n\n# Example usage\nmy_list = [1, 9, 5, 2, 1, 8, 6, 6, 3, 4, 10, 7]\nsorted_list = insertion_sort(my_list)\nprint(sorted_list)  # Output: [1, 1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10]\n```\n\n**Time Complexity Analysis of Insertion Sort:**\n\nInsertion Sort has a time complexity of **O(n^2)** in the worst and average case, but **O(n)** in the best case.\n\n* **Worst Case:** The worst case occurs when the list is sorted in reverse order. In this case, the outer loop iterates 'n-1' times, and the inner loop iterates 'i' times for each pass of the outer loop. This leads to a total of approximately n^2/2 comparisons, which is considered O(n^2).\n\n* **Best Case:** The best case occurs when the list is already sorted. In this case, the outer loop iterates 'n-1' times, but the inner loop executes only once for each pass. Therefore, the time complexity in the best case is O(n).\n\n* **Average Case:** The average case complexity is also O(n^2).\n\n**Why Insertion Sort is Faster than Bubble Sort:**\n\nWhile both algorithms have the same worst-case time complexity, Insertion Sort tends to be faster in practice, especially for partially sorted lists. Here's why:\n\n* **Adaptive Nature:** Insertion Sort is an **adaptive algorithm**, meaning it performs better when the input list is partially sorted. If a significant portion of the list is already sorted, the inner loop of Insertion Sort will run fewer times, leading to faster execution.\n\n* **Fewer Swaps:** Insertion Sort performs fewer swaps compared to Bubble Sort, which can be beneficial when dealing with large data sets. It typically only shifts elements to the right to find the correct position for the current element, rather than repeatedly swapping adjacent elements.\n\n**Conclusion:**\n\nWhile both Bubble Sort and Insertion Sort have a time complexity of O(n^2), Insertion Sort is generally preferred due to its adaptive nature and fewer swaps. For larger datasets, algorithms like Merge Sort or Quick Sort are typically preferred as they have better average-case time complexities of O(n log n).\n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}
