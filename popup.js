const problemSection = document.getElementsByClassName("bookmarked-problems")[0];

document.addEventListener("DOMContentLoaded", showAllBookmarkedProblem);


async function showAllBookmarkedProblem() {
    const result = await chrome.storage.sync.get(["bookmarkedProblems"]);
    const bookmarkedProblems = result.bookmarkedProblems || [];

    if (bookmarkedProblems.length === 0) {
        const temp = document.createElement("h4");
        temp.innerHTML = "You have not added any problems!";
        temp.classList = "temp-text";

        problemSection.appendChild(temp);
        return;
    }

    bookmarkedProblems.forEach(problem => {
        const problemDiv = document.createElement("div");
        problemDiv.classList = "each-problem";

        const problemNameAsH4 = document.createElement("h4");
        problemNameAsH4.textContent = problem.problemName;

        const gotoProblemButton = document.createElement("button");
        gotoProblemButton.textContent = "go to problem";
        gotoProblemButton.addEventListener("click", () => gotoProblem(problem));

        const deleteProblem = document.createElement("button");
        deleteProblem.textContent = "delete";
        deleteProblem.addEventListener("click", () => deleteProblemFromSavedList(bookmarkedProblems, problem));



        problemDiv.appendChild(problemNameAsH4);
        problemDiv.appendChild(gotoProblemButton);
        problemDiv.appendChild(deleteProblem);


        problemSection.appendChild(problemDiv);
    });
}



function gotoProblem(problem) {
    chrome.tabs.create({ url: problem.problemUrl });
}

async function deleteProblemFromSavedList(bookmarkedProblems, problem) {
  const confirmDelete = confirm(`Are you sure you want to delete "${problem.problemName}"?`);

  if (!confirmDelete) {
    return; // user clicked "Cancel"
  }

  // Filter out the problem to delete
  const updatedList = bookmarkedProblems.filter(
    p => p.problemUniqueId !== problem.problemUniqueId
  );

  // Save the updated list
  await chrome.storage.sync.set({ bookmarkedProblems: updatedList });


  // Optionally reload or update UI
  location.reload(); // Or just remove the DOM element directly
}
