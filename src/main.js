import App from './App.html';


const app = new App({
	target: document.getElementsByTagName('app')[0],
	data: {
		appName: 'VLAD VK',
		componentName: '',
		rights: {},
		isLoaded: true,
		rightsReady: false,
		newOrder: JSON.parse(localStorage.getItem('newOrder')),
		links: [{
			name: 'ВК-группы',
			value: 'vk-groups',
		}, {
			name: 'Пакеты',
			value: 'packages',
		}, {
			name: 'Пользователи',
			value: 'users',
		}, {
			name: 'Заказы',
			value: 'orders',
		}],
		path: window.location.pathname,
		toast: {
			icon: '',
			text: 'Привет',
			type: 'success'
		}
	}
});

export default app;
