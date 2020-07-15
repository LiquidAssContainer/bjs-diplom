'use strict'

let logoutButton = new LogoutButton();

logoutButton.action = () => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
    }
})

let profileWidget = new ProfileWidget(); // как лучше: создавать сразу все объекты сверху, или как я написал — это нормальная практика?

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
})

let ratesBoard = new RatesBoard();

let getStocks = () => ApiConnector.getStocks(response => {
    if (response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    }
})

getStocks(); // можно ли было лучше реализовать эти две строки кода?
setInterval(getStocks, 1000 * 60);

let moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, updateProfile);
}
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, updateProfile);
}
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, updateProfile);
}

function updateProfile(response) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(false, 'Действие успешо выполнено'); // не вижу положительного ответа от сервера, написал текст сам
    } else {
        moneyManager.setMessage(true, response.data);
    }
}

let favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success) {
        updateFavorites(response);
    }
})

favoritesWidget.addUserCallback = userData => {
    ApiConnector.addUserToFavorites(userData, response => {
        if (response.success) {
            updateFavorites(response);
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
}

favoritesWidget.removeUserCallback = userData => {
    ApiConnector.removeUserFromFavorites(userData, response => {
        if (response.success) {
            updateFavorites(response);
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
}

function updateFavorites(response) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
}