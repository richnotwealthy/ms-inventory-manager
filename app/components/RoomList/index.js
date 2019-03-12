import React, {Component} from 'react'
import RoomCreator from './RoomCreator'
import RoomDeleter from './RoomDeleter'
import axios from 'axios'
import {Card, Button} from 'antd'

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
          {JSON.stringify(this.state.roomList)}
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
