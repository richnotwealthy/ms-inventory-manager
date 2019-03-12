import React, {Component} from 'react'
import axios from 'axios'
import {Modal, Input, Select, message} from 'antd'
const { Option } = Select

class RoomCreator extends Component {
	state = {
		newRid: '',
		newStatus: undefined
	}

	handleOk = () => {
		if (this.state.newRid.length === 0 || !this.state.newStatus) {
			message.error('All fields required!')
			return
		}

		axios.post('/db/new/room', {
			rid: this.state.newRid,
			rstatus: this.state.newStatus
		}).then(res => {
			// reset values
			this.setState({
				newRid: '',
				newStatus: undefined
			})

			// refresh parent
			this.props.actions.getAllRooms()
			this.props.actions.hideRoomCreator()
		})
	}

	render() {
		return (
			<Modal
				title={'New Room'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.actions.hideRoomCreator}
				okText='Confirm'
			>
				<Input
					value={this.state.newRid}
					onChange={e => this.setState({ newRid: e.target.value })}
					placeholder='Room ID'
				/>
				<Select
					placeholder='Status'
					value={this.state.newStatus}
					style={{ width: '100%', marginTop: 16 }}
					onChange={newStatus => this.setState({ newStatus })}
				>
					<Option key='G'>Healthy</Option>
					<Option key='Y'>Working</Option>
					<Option key='R'>Broken</Option>
				</Select>
			</Modal>
		)
	}
}

export default RoomCreator
