import React, {Component} from 'react'
import axios from 'axios'
import {Select, Modal, message} from 'antd'
const { Option } = Select

class RoomAssigner extends Component {
	state = {
		allRooms: [],
		selectedRoom: undefined,
	}

	componentDidMount() {
		axios.get('/db/get/rooms').then(res => {
			this.setState({ allRooms: res.data })
		})
	}

	assignRoom = () => {
		if (!this.state.selectedRoom || this.state.selectedRoom.length === 0) {
			message.error('You must select a room!')
			return
		}

		this.props.actions.setLndbleRoom(this.props.lid, this.state.selectedRoom).then(() => {
			this.setState({
				selectedRoom: undefined
			})

			this.props.actions.hideRoomAssigner()
		})
	}

	render() {
		return (
			<Modal
				visible={this.props.visible}
				onCancel={this.props.actions.hideRoomAssigner}
				onOk={this.assignRoom}
				okText='Confirm'
				title={this.props.lid}
			>
				<Select
					style={{ width: '100%' }}
					value={this.state.selectedRoom}
					onChange={selectedRoom => this.setState({ selectedRoom })}
					placeholder='Select Room to Assign'
					showSearch
					filterOption={(val, e) => e.props.children.toLowerCase().indexOf(val.toLowerCase()) > -1}
				>
					{this.state.allRooms.map(room => (
						<Option key={room.rid}>{room.rid}</Option>
					))}
				</Select>
			</Modal>
		)
	}
}

export default RoomAssigner
