var index = (req, res) => {
	res.render('admin/index', {
		page: 'index'
	})
}

module.exports = {
	index
}
