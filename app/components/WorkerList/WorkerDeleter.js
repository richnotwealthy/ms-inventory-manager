import React, {Component} from 'react'
import axios from 'axios'
import {Modal, Select, message} from 'antd'
const { Option } = Select

class WorkerDeleter extends Component {
	state = {
		selectedNetID: undefined
	}

	handleOk = () => {
		if (!this.state.selectedNetID) {
			message.error('Select an employee to delete!')
			return
		}

		axios.post('/db/delete/worker', {
			netid: this.state.selectedNetID,
		}).then(res => {
			// reset values
			this.setState({
				selectedNetID: undefined
			})

			// refresh parent
			this.props.actions.getAllWorkers()
			this.props.actions.hideWorkerDeleter()
		})
	}

	render() {
		return (
			<Modal
				title={'Delete Employee'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.actions.hideWorkerDeleter}
				okText='Delete'
				okType='danger'
			>
				<Select
					style={{ width: '100%' }}
					value={this.state.selectedNetID}
					onChange={selectedNetID => this.setState({ selectedNetID })}
					placeholder='Select Employee to Delete'
					showSearch
					filterOption={(val, e) => e.props.children.toLowerCase().indexOf(val.toLowerCase()) > -1}
				>
					{this.props.allWorkers.map(worker => (
						<Option key={worker.netid}>{worker.wname + ' - ' + worker.netid}</Option>
					))}
				</Select>
			</Modal>
		)
	}
}

export default WorkerDeleter