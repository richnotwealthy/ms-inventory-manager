import React, {Component} from 'react'
import axios from 'axios'
import {Modal, Select, message, Alert} from 'antd'
const { Option } = Select

class RoomDeleter extends Component {
	state = {
		selectedRid: undefined
	}

	handleOk = () => {
		if (!this.state.selectedRid) {
			message.error('Select a room to delete!')
			return
		}

		axios.post('/db/delete/room', {
			rid: this.state.selectedRid,
		}).then(res => {
			// reset values
			this.setState({
				selectedRid: undefined
			})

			// refresh parent
			this.props.actions.getAllRooms()
			this.props.actions.hideRoomDeleter()
		})
	}

	render() {
		return (
			<Modal
				title={'Delete Room'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.actions.hideRoomDeleter}
				okText='Delete'
				okType='danger'
			>
				<Select
					style={{ width: '100%' }}
					value={this.state.selectedRid}
					onChange={selectedRid => this.setState({ selectedRid })}
					placeholder='Select Room to Delete'
					showSearch
					filterOption={(val, e) => e.props.children.toLowerCase().indexOf(val.toLowerCase()) > -1}
				>
					{this.props.allRooms.map(room => (
						<Option key={room.rid}>{room.rid}</Option>
					))}
				</Select>
				<Alert
					style={{ marginTop: 16 }}
					message={'Deleting a room also deletes all associated logs and equipment (lendables will be returned to storage).'}
					type='error'
				/>
			</Modal>
		)
	}
}

export default RoomDeleter
