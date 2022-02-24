import './styleshets/popup.styl'

tag Application < section
	def render
		<self>
			<article> 'Article'

tag Header < header

let yt = setInterval(&) do if document:body and not clearInterval yt
	Imba.mount <Header -> <h1> 'Информация о теущем проекте'
	Imba.mount <main ->
		<nav> 'Nav'
		<Application>
	Imba.mount <footer ->
		'Состояние передачи данных'

