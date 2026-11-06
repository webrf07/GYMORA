// =========================
// GYMORA SIDEBAR
// =========================

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

if (menuButton && sidebar) {

    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {

        if (
            window.innerWidth <= 850 &&
            sidebar.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            sidebar.classList.remove("open");
        }

    });

}


// =========================
// ACTIVE NAVIGATION
// =========================

const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

document.querySelectorAll(".nav-item").forEach(item => {

    const href = item.getAttribute("href");

    if (
        (currentPage === "" || currentPage === "index") &&
        href === "index.html"
    ) {
        item.classList.add("active");
    }

    else if (href === currentPage + ".html") {
        item.classList.add("active");
    }

});


// =========================
// SEARCH
// =========================

const searchInput = document.querySelector(".search input");

if (searchInput) {

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            const query = searchInput.value.trim();

            if (query) {
                window.location.href =
                    "workouts.html?search=" +
                    encodeURIComponent(query);
            }

        }

    });

}


// =========================
// DASHBOARD
// =========================

// Future Firebase integration:
//
// Calories      -> User activity data
// Workout Time  -> Workouts database
// Weekly Goal   -> Progress database
// Nutrition     -> Nutrition database
// AI Gym        -> AI Coach system
//
// Keep dashboard data connected to the
// corresponding sections, not hardcoded
// permanently in this file.