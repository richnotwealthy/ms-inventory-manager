import React, {Component} from 'react'
import RoomCreator from './RoomCreator'
import RoomDeleter from './RoomDeleter'
import axios from 'axios'
import _ from 'lodash'
import {Card, Collapse, Table, Icon, Button,
	Menu, Dropdown, Tag, Divider, Popconfirm, Input} from 'antd'
const {Panel} = Collapse

class RoomList extends Component {
	state = {
		roomList: [],
		showRoomCreator: false,
		showRoomDeleter: false,
	}


	getAllRooms = () => {
		axios.get('/db/get/rooms').then(res => {
				this.setState({ roomList: res.data })
			}
		)
	}

	componentDidMount() {
		this.getAllRooms()
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
								value={this.state.roomFilter}
								onChange={e => this.setState({ roomFilter: e.target.value })}
							/>
							<Button.Group style={{ float: 'right' }}>
								<Button
									icon='plus'
									size='small'
									onClick={() => this.setState({ showRoomCreator: true })}
								/>
								<Button
									icon='minus'
									size='small'
									onClick={() => this.setState({ showRoomDeleter: true })}
								/>
							</Button.Group>
						</div>
					)}
				>

				</Card>
				<RoomCreator
					actions={{
						getAllRooms: this.getAllRooms,
						hideRoomCreator: () => this.setState({ showRoomCreator: false })
					}}
					visible={this.state.showRoomCreator}
				/>
				<RoomDeleter
					actions={{
						getAllRooms: this.getAllRooms,
						hideRoomDeleter: () => this.setState({ showRoomDeleter: false })
					}}
					allRooms={this.state.roomList}
					visible={this.state.showRoomDeleter}
				/>
			</div>
		)
	}
}

export default RoomList
