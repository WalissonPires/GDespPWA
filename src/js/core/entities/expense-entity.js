App.Utils.Namespace.CreateIfNotExists('App.Entities').Expense = {
	id: 'GUID',
	description: 'Coelho Diniz',
	currentInstallment: 1,
	totalInstallment: 12,
	createDate: '2019-09-01T12:00:00Z',
	purchaseDate: '2019-09-01T12:00:00Z',
	paidDate: null,
	price: 99.99,
	category: {
		id: 'GUID',
		name: 'Casa'
    },
	origin: {
		id: 'GUID',
		name: 'NUBANK'
    },
	members: [{
		id: 'GUID',
		name: 'Walisson',
		pricePrice: 33.33
    }]
};