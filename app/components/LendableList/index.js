import React, {Component} from 'react'
import RoomAssigner from './RoomAssigner'
import LendableCreator from './LendableCreator'
import LendableDeleter from './LendableDeleter'
import axios from 'axios'
import {Card, Button, List, Avatar, Dropdown, Menu, Popconfirm, Input} from 'antd'

const status = {
	G: <Avatar size='small' style={{ backgroundColor: '#52c41a' }} icon="check" />,
	Y: <Avatar size='small' style={{ backgroundColor: '#faad14' }} icon="exclamation" />,
	R: <Avatar size='small' style={{ backgroundColor: '#f5222d' }} icon="close" />
}

class LendableList extends Component {
	state = {
		allLendables: [],
		showLendableCreator: false,
		showLendableDeleter: false,
		showRoomAssigner: false,
		currentLndble: '',
		lidFilter: '',
		ltypeFilter: '',
	}

	getAllLendables = () => {
		axios.get('/db/get/lendables').then(res => {
			this.setState({ allLendables: res.data })
		})
	}

	componentDidMount() {
		this.getAllLendables()
	}

	setLndbleRoom = (lid, rid) => {
		return axios.post('/db/set/lendable/room', {
			lid,
			rid
		}).then(res => {
			this.getAllLendables()
		})
	}

	handleStatusUpdate = lid => {
		return e => {
			const newStatus = e.key

			axios.post('/db/set/lendable/status', {
				lid,
				lstatus: newStatus
			}).then(res => {
				this.getAllLendables()
			})
		}
	}

	renderLendOrReturn = (lid, rid) => {
		if (rid)
			return (
				<Popconfirm
					title='Are you sure?'
					onConfirm={() => this.setLndbleRoom(lid, null)}
					okText='Return'
					okType='danger'
					cancelText='Cancel'
				>
					<Button
						icon='loading'
						type='danger'
					>
						Return Item
					</Button>
				</Popconfirm>
			)

		return (
			<Button
			type='primary'
			icon='select'
			onClick={() => this.setState({ showRoomAssigner: true, currentLndble: lid })}
			>
				Lend
			</Button>
		)
	}

	renderActions = (lid, rid) => {
		const menu = lid => (
			<Menu onClick={this.handleStatusUpdate(lid)}>
				<Menu.Item key='G' name='G'>Healthy</Menu.Item>
		    	<Menu.Item key='Y' name='Y'>Working</Menu.Item>
		    	<Menu.Item key='R' name='R'>Broken</Menu.Item>
			</Menu>
		)

		return [
			<Button.Group>
				<Dropdown trigger={['click']} overlay={menu(lid)}>
					<Button icon='down' />
				</Dropdown>
				{this.renderLendOrReturn(lid, rid)}
			</Button.Group>
		]
	}

	renderLendables = () => {
		let { allLendables, lidFilter, ltypeFilter } = this.state

		allLendables = allLendables.filter(({ lid, ltype }) =>
			lid.toLowerCase().indexOf(lidFilter.toLowerCase()) > -1
			&& ltype.toLowerCase().indexOf(ltypeFilter.toLowerCase()) > -1
		)

		return (
			<List
				itemLayout='horizontal'
				dataSource={allLendables}
				renderItem={lndble => (
					<List.Item
						actions={this.renderActions(lndble.lid, lndble.rid)}
					>
						<List.Item.Meta
							avatar={status[lndble.lstatus]}
							title={(<span style={{ fontWeight: 'bold' }}>{lndble.lid}</span>)}
							description={lndble.ltype}
						/>
						<span style={{ fontStyle: 'italic' }}>{lndble.rid ? lndble.rid : 'Storage'}</span>
					</List.Item>
				)}
			/>
		)
	}

	render() {
		return (
			<div>
				<Card title={(
						<div>
							<span>{this.props.title}</span>
							<Input
								style={{ marginLeft: 16, width: '20%' }}
								placeholder='ID'
								value={this.state.lidFilter}
								onChange={e => this.setState({ lidFilter: e.target.value })}
							/>
							<Input
								style={{ marginLeft: 16, width: '20%' }}
								placeholder='Type'
								value={this.state.ltypeFilter}
								onChange={e => this.setState({ ltypeFilter: e.target.value })}
							/>
							<Button.Group style={{ float: 'right' }}>
								<Button
									icon='plus'
									size='small'
									onClick={() => this.setState({ showLendableCreator: true })}
								/>
								<Button
									icon='minus'
									size='small'
									onClick={() => this.setState({ showLendableDeleter: true })}
								/>
							</Button.Group>
						</div>
					)}
				>
					{this.renderLendables()}
				</Card>
				<RoomAssigner
					visible={this.state.showRoomAssigner}
					actions={{
						setLndbleRoom: this.setLndbleRoom,
						hideRoomAssigner: () => this.setState({ showRoomAssigner: false })
					}}
					lid={this.state.currentLndble}
				/>
				<LendableCreator
					actions={{
						getAllLendables: this.getAllLendables,
						hideLendableCreator: () => this.setState({ showLendableCreator: false })
					}}
					visible={this.state.showLendableCreator}
				/>
				<LendableDeleter
					actions={{
						getAllLendables: this.getAllLendables,
						hideLendableDeleter: () => this.setState({ showLendableDeleter: false })
					}}
					allLendables={this.state.allLendables}
					visible={this.state.showLendableDeleter}
				/>
			</div>
		)
	}
}

export default LendableList
