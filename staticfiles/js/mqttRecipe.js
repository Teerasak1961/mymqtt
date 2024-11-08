
// Function to handle recipe-related updates
export function updateRecipe(topic, message) {
    if (topic === 'recipe') {
        updateElementIfExists('Recipe-ID', message['ID']);
        updateElementIfExists('Recipe-No', message['RecipeNo']);
        updateElementIfExists('Recipe-Name', message['RecipeName']);
        updateElementIfExists('Recipe-MixingSpeed', message['MixingSpeed'], 2);
        updateElementIfExists('Recipe-MixingTemp', message['MixingTemp'], 2);
        updateElementIfExists('Recipe-MixingTime', message['MixingTime'], 0);
    }
}

// Helper function to update an element if it exists on the page
function updateElementIfExists(elementId, value, decimals = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        if (typeof value === 'number') {
            element.textContent = value.toFixed(decimals);
        } else {
            element.textContent = value;
        }
    }
}

