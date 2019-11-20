(function (Vue) {
	const items = [
		{
			id : 1,
			content : 'Vue.js',
			completed : false
		}
	]
	const LOCAL_STORAGE_KEY = 'todomvc-vue'
	const itemsStorage = {
		get(){
			return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
		},
		save(items){
			localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(items))
		}
	}
	Vue.directive('app-focus',{
		inserted(el, binding){
			el.focus()
		},
		update(el, binding){
			if(binding.value){
				el.focus()
			}
		}
	})
	var vm = new Vue({
		el: '#todoapp',
		data: {
			items: itemsStorage.get(),
			currentItem: null,
			filterStatus: 'all'
		},
		watch: {
			items: {
				deep: true,
				handler: function(newItems,oldItems){
					itemsStorage.save(newItems)
				}
			}
		},
		methods: {
			addItem(event){
				console.log('addItem',event.target.value)
				const content = event.target.value.trim()
				if(!content.length){
					return
				}
				const id = this.items.length + 1
				this.items.push({
						id,
						content,
						completed : false
					})
				event.target.value = ''
			},
			removeItem(index){
				this.items.splice(index,1);
			},
			clearCompleted(){
				this.items = this.items.filter(item => !item.completed)
			},
			toEdit(item){
				this.currentItem = item
			},
			cancelEdit(){
				this.currentItem = null
			},
			finishEdit(item,index,event){
				const content = event.target.value.trim()
				if(!content){
					this.removeItem(index)
					return
				}
				item.content = content
				this.currentItem = null
			}
		},
		computed: {
			toggleAll:{
				set(newStatus){
					this.items.forEach((item) => {
						item.completed = newStatus
					})
				},
				get(){
					return this.remaining === 0
				}
			},
			clearCompletedButtonShow() {
				return this.items.length > this.remaining 
			},
			remaining(){
				const unItems = this.items.filter((item) => {
					return !item.completed
				})
				return unItems.length
			},
			filterItems(){
				switch (this.filterStatus) {
					case 'active':
						return this.items.filter(item => !item.completed)
						break;
					case 'completed':
						return this.items.filter(item => item.completed)
						break;
					default:
						return this.items
						break;
				}
			}
		}
	})

	window.onhashchange = function(){
		console.log(window.location.hash)
		const hash = window.location.hash.substr(2) || 'all'
		vm.filterStatus = hash
	}

	window.onhashchange()
	

})(Vue);
