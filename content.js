const bookmarkIconURL = chrome.runtime.getURL("assets/bookmark.jpg");

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes('/problems/')) {
    showMyBookMarkIcon();
  }
});


const observer = new MutationObserver(() => {
  if (window.location.pathname.includes('/problems/')) {
    const iconExists = document.querySelector('#my-bookmark-icon');
    if (!iconExists) {
      showMyBookMarkIcon();
      
    }
  }
});
// Start observing changes to the DOM
observer.observe(document.body, { childList: true, subtree: true });



function showMyBookMarkIcon() {

  const alreadyExists = document.querySelector('#my-bookmark-icon');
  if (alreadyExists) return;

  const aboveElement = document.getElementsByClassName(
    "d-flex align-items-center flex-wrap gap-2 justify-content-between mb-2"
  )[0];

  if (!aboveElement) {
    console.warn("Reward button not found");
    return;
  }

  const myBookMarkIcon = document.createElement("img");
  myBookMarkIcon.src = bookmarkIconURL;
  myBookMarkIcon.alt = "Bookmark Icon";
  myBookMarkIcon.id = "my-bookmark-icon"; // Use id instead of class
  myBookMarkIcon.style.height = "30px";
  myBookMarkIcon.style.width = "30px";

  aboveElement.parentNode.insertBefore(
    myBookMarkIcon,
    aboveElement.nextSibling
  );

  myBookMarkIcon.addEventListener("click", saveProblemForFuture);
}



async function saveProblemForFuture() {
  const problemUrl = window.location.href;
  const problemName = document.getElementsByClassName(
    "coding_problem_info_heading__G9ueL fw-bolder rubik fs-4 mb-0"
  )[0].textContent;
  const problemUniqueId = getProblemsUniqueId(problemUrl);

  
  const result = await chrome.storage.sync.get(["bookmarkedProblems"]);
  const bookmarkedProblems = result.bookmarkedProblems || [];
  
  const isProblemAlreadyExist = bookmarkedProblems.some((problem) => problem.problemUniqueId.toLowerCase() === problemUniqueId.toLowerCase());
  if (isProblemAlreadyExist) {
      console.log("Problem already bookmarked.");
      alert(`You have Already Added ${problemName} !`);
      return;
    }
    
    const newProblem = {
        problemUrl: problemUrl,
        problemName: problemName,
        problemUniqueId: problemUniqueId,
    };
    
    
    console.log("Before push: ", bookmarkedProblems);
    
    bookmarkedProblems.push(newProblem);
    
    await chrome.storage.sync.set({ bookmarkedProblems });
    
    alert(`${problemName} bookmarked Successfully!`);
    console.log("Bookmark updated:", bookmarkedProblems);
    
}


function getProblemsUniqueId(url) {
    const problemsPart = url.split("/problems/")[1];
    if (!problemsPart) return null;
    
    const slug = problemsPart.split("?")[0];
    return slug;
}
