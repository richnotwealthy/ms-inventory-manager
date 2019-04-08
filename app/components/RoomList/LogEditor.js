import React, {Component} from 'react'
import axios from 'axios'
import {Modal, Input, Select, message} from 'antd'
const { TextArea } = Input
const { Option } = Select

class LogEditor extends Component {
	state = {
		workerList: [],
		selectedWorkers: [],
		description: ''
	}

	getAllWorkers = () => {
		axios.get('/db/get/workers').then(res => {
			this.setState({ workerList: res.data })
			}
		)
	}

	componentDidMount() {
		this.getAllWorkers()
	}

	handleLog = () => {
		const { selectedWorkers, description } = this.state

		if (description.length === 0 || selectedWorkers.length === 0) {
			message.error('All fields required!')
			return
		}

		axios.post('/db/new/history', {
			rid: this.props.rid,
			hworkerList: selectedWorkers,
			hdescription: description
		}).then(res => {
			// refresh logs in parent
			this.props.actions.getAllHistory()
			this.props.actions.hideLogEditor()

			// clear fields
			this.setState({
				selectedWorkers: [],
				description: ''
			})
		})
	}

	renderWorkerList = () => {
		return this.state.workerList.map(w => (
			<Option key={w.netid} value={w.netid}>{w.wname + ' - ' + w.netid}</Option>
		))
	}

	render() {
		return (
			<Modal
				title={'New Log for ' + this.props.rid}
				visible={this.props.visible}
				onOk={this.handleLog}
				onCancel={this.props.actions.hideLogEditor}
				okText='Confirm'
			>
				<TextArea
					value={this.state.description}
					rows={4}
					onChange={e => this.setState({ description: e.target.value })}
					placeholder='What happened?'
				/>
				<Select
					mode='multiple'
					value={this.state.selectedWorkers}
					onChange={selectedWorkers => this.setState({ selectedWorkers })}
					style={{ width: '100%', marginTop: 16 }}
					placeholder='Relevant Employees'
					filterOption={(val, e) => e.props.children.toLowerCase().indexOf(val.toLowerCase()) > -1}
				>
					{this.renderWorkerList()}
				</Select>
			</Modal>
		)
	}
}

export default LogEditor
