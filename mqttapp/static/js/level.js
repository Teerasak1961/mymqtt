
    // Get references to elements
    const slider = document.getElementById("myLevel");
    const levelPercent = document.getElementById("levelPercent");
    const tankFill = document.getElementById("tankFill");
    const tankLevelText = document.getElementById("tankLevelText");

    // Update the tank level as the slider moves
    slider.addEventListener("input", function() {
        const value = slider.value;
        // Update the displayed percentage
        levelPercent.textContent = value + "%";
        tankLevelText.textContent = value + "%";
        // Adjust the tank fill height based on the slider value
        tankFill.style.height = value + "%";
    });
