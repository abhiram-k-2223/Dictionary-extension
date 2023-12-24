// popup.js
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("fetchButton").addEventListener("click", fetchDefinition);
});

function fetchDefinition() {
    const wordInput = document.getElementById("word").value;
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Word not found in the dictionary.`);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(data => {
            // Clear previous results
            const ulElement = document.querySelector('ul');
            ulElement.innerHTML = '';

            if (data && data.length > 0 && data[0].meanings) {
                const meanings = data[0].meanings.reduce((acc, meaning) => {
                    if (meaning.definitions) {
                        acc.push(...meaning.definitions.map(def => def.definition));
                    }
                    return acc;
                }, []);

                // Display the meanings in the list
                meanings.forEach(definition => {
                    const liMarkup = `<li>${definition}</li>`;
                    ulElement.insertAdjacentHTML('beforeend', liMarkup);
                });

                // Hide the definitionDiv
                const definitionDiv = document.getElementById("definition");
                definitionDiv.style.display = "none";

                document.getElementById("page1").style.display = "none";
                document.getElementById("page2").style.display = "block";
            } else {
                const definitionDiv = document.getElementById("definition");
                definitionDiv.innerHTML = "Definition not found.";
                definitionDiv.style.display = "block";

                document.getElementById("page1").style.display = "none";
                document.getElementById("page2").style.display = "none";
            }
        })
        .catch(error => console.error("Error fetching definition:", error));
}
