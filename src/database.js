const updateDatabase = (data) => {
    localStorage.setItem("todoListManager", JSON.stringify(data));
};

const checkDatabase = () => {
    return localStorage.getItem("todoListManager") !== null;
};

const loadDatabase = () => {
    return JSON.parse(localStorage.getItem("todoListManager"));
};

export {
    updateDatabase,
    checkDatabase,
    loadDatabase
};