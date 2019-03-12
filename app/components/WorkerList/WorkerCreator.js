import React, {Component} from 'react'
import axios from 'axios'
import {Modal, Input, message} from 'antd'

class WorkerCreator extends Component {
	state = {
		newNetID: '',
		newName: '',
	}

	handleOk = () => {
		if (this.state.newNetID.length === 0 || this.state.newName.length === 0) {
			message.error('All fields required!')
			return
		}

		axios.post('/db/new/worker', {
			netid: this.state.newNetID,
			wname: this.state.newName,
		}).then(res => {
			// reset values
			this.setState({
				newNetID: '',
				newName: '',
			})

			// refresh parent
			this.props.actions.getAllWorkers()
			this.props.actions.hideWorkerCreator()
		})
	}

	render() {
		return (
			<Modal
				title={'Register Employee'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.actions.hideWorkerCreator}
				okText='Confirm'
			>
				<Input
					value={this.state.newNetID}
					onChange={e => this.setState({ newNetID: e.target.value })}
					placeholder='NetID'
				/>
				<Input
					value={this.state.newName}
					style={{ marginTop: 16 }}
					onChange={e => this.setState({ newName: e.target.value })}
					placeholder='Name'
				/>
			</Modal>
		)
	}
}

export default WorkerCreator