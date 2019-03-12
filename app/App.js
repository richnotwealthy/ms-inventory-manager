import './App.css'
import React, {Component} from 'react'
import RoomList from './components/RoomList'
import LendableList from './components/LendableList'
import WorkerList from './components/WorkerList'
import {Layout, Menu, Icon} from 'antd'
const {Content, Sider} = Layout
const {Item} = Menu

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collapsed: false,
			page: 'rooms'
		}
	}

	onPageSelect = ({ item, key, selectedKeys }) => {
		this.setState({
			page: key
		})
	}

	render() {
		return (
			<div className='App'>
				<Layout style={{ minHeight: '100vh' }}>
					<Sider collapsible collapsed={this.state.collapsed} onCollapse={(collapsed) => this.setState({ collapsed })}>
						<div className='App-logo'></div>
						<Menu theme='dark' defaultSelectedKeys={['rooms']} mode='inline' onSelect={this.onPageSelect}>
							<Item key='rooms'>
								<Icon type='appstore-o' />
								<span>Rooms</span>
							</Item>
							<Item key='lendables'>
								<Icon type='tool' />
								<span>Lendables</span>
							</Item>
							<Item key='workers'>
								<Icon type='user' />
								<span>Employees</span>
							</Item>
						</Menu>
					</Sider>
					<Content style={{ padding: 24 }}>
            {this.state.page === 'rooms' && (<RoomList title='Rooms' />)}
            {this.state.page === 'lendables' && (<LendableList title='Lendables' />)}
						{this.state.page === 'workers' && (<WorkerList title='Employees' />)}
					</Content>
				</Layout>
			</div>
		)
	}
}

export default App
