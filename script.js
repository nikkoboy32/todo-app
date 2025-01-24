$(document).ready(function() {

   function darkMode() {
        $('.dark_mode_btn span').toggleClass('dark')
        $('main').toggleClass('dark')
        $('body').toggleClass('dark-mode')
        $('.input_con input').toggleClass('dark')
        $('.input_con').toggleClass('dark')
        $('.input_circle').toggleClass('dark')
        // $('.list_con > ul li').toggleClass('dark')
        $('.list_con').toggleClass('dark')
        $('.bottom_nav').toggleClass('dark')
        $('.bottom_buttons ul').toggleClass('dark')
   }

   $('.dark_mode_btn').click(function() {
        darkMode()
   })

    let windowWidth = $(window).width()

    function swap() {

        if(windowWidth <= 540) {
            $(".bottom_buttons").insertAfter(".list_con")
            $(".bottom_nav").insertAfter(".list_con ul")
        }
        else {
            $(".bottom_buttons").insertAfter(".item_left")
            $(".bottom_nav").insertAfter(".list_con")
        }
    }

    swap()

    $(window).resize(function() {
         windowWidth = $(this).width()

        swap()

    })

    let tasks = [];
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("myTasks")) || [];
    tasks = tasksFromLocalStorage;
    
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    
    const ulElement = document.getElementById("sortableTaskList");
    const inputField = $(".todo_input");
    
    function updateTaskCount() {
        const activeTasks = tasks.filter((_, i) => !completedTasks.includes(i)).length;
        $(".item_left_num").html(activeTasks);
    }
    
    function showList(filter = "all") {
        ulElement.innerHTML = "";
        let listItem = "";
    
        for (let i = 0; i < tasks.length; i++) {
            const isChecked = completedTasks.includes(i);
            const liClass = isChecked ? "checked" : "";
    
            if (
                (filter === "all") ||
                (filter === "active" && !isChecked) ||
                (filter === "completed" && isChecked)
            ) {
                listItem += `
                    <li class="${liClass}">
                        <div class="input_circle ${isChecked ? "checked" : ""}" data-index="${i}"></div>
                        ${tasks[i]}
                        <div class="input_close" data-index="${i}">
                            <figure class="m-0">
                                <img src="images/icon-cross.svg" alt="cross icon">
                            </figure>
                        </div>
                    </li>
                `;
            }
        }
    
        ulElement.innerHTML = listItem;
    
        $(".input_circle").off().click(function () {
            const index = $(this).data("index");
            toggleTaskCompletion(index);
        });
    
        $(".input_close").off().click(function () {
            const index = $(this).data("index");
            removeTask(index);
        });
    
        updateTaskCount();
    }
    
    function addTask() {
        const inputValue = inputField.val().trim();
    
        if (inputValue !== "") {
            tasks.push(inputValue);
            localStorage.setItem("myTasks", JSON.stringify(tasks));
            inputField.val("");
            showList();
        } else {
            alert("Please add a task");
        }
    }
    
    function removeTask(index) {
        tasks.splice(index, 1);
        completedTasks = completedTasks.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i));
        localStorage.setItem("myTasks", JSON.stringify(tasks));
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        showList();
    }
    
    function toggleTaskCompletion(index) {
        index = parseInt(index);
        if (completedTasks.includes(index)) {
            completedTasks = completedTasks.filter((i) => i !== index);
        } else {
            completedTasks.push(index);
        }
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        showList();
    }
    
    function clearCompletedTasks() {
        tasks = tasks.filter((_, i) => !completedTasks.includes(i));
        completedTasks = [];
        localStorage.setItem("myTasks", JSON.stringify(tasks));
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        showList();
    }
    
    function handleFilterButtons() {
        $(".bottom_buttons li").off().click(function () {
            $(".bottom_buttons li").removeClass("active");
            $(this).addClass("active");
    
            const filter = $(this).text().toLowerCase();
            showList(filter);
        });
    }
    
    const sortable = new Sortable(ulElement, {
        animation: 150,
        onEnd: function () {
            const newOrder = Array.from(ulElement.children)
                .map((li) => li.textContent.trim())
                .filter((item) => item !== "");
            tasks = newOrder;
            localStorage.setItem("myTasks", JSON.stringify(tasks));
            showList();
        },
    });
    
    showList();
    handleFilterButtons();
    
    $(document).on("click", ".input_btn", function () {
        console.log("Task button clicked");
        addTask();
    });
    
    inputField.keydown(function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });
    
    $(".clear_completed").off().click(clearCompletedTasks);
    
    

})