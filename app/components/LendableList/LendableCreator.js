import React, {Component} from 'react'
import axios from 'axios'
import {Modal, Input, Select, message} from 'antd'
const { Option } = Select

class LendableCreator extends Component {
	state = {
		newLid: '',
		newType: '',
		newStatus: undefined
	}

	handleOk = () => {
		if (this.state.newLid.length === 0 || this.state.newType.length === 0 || !this.state.newStatus) {
			message.error('All fields required!')
			return
		}

		axios.post('/db/new/lendable', {
			lid: this.state.newLid,
			ltype: this.state.newType,
			lstatus: this.state.newStatus
		}).then(res => {
			// reset values
			this.setState({
				newLid: '',
				newType: '',
				newStatus: undefined
			})

			// refresh parent
			this.props.actions.getAllLendables()
			this.props.actions.hideLendableCreator()
		})
	}

	render() {
		return (
			<Modal
				title={'New Lendable'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.actions.hideLendableCreator}
				okText='Confirm'
			>
				<Input
					value={this.state.newLid}
					onChange={e => this.setState({ newLid: e.target.value })}
					placeholder='Lendable ID'
				/>
				<Input
					value={this.state.newType}
					style={{ marginTop: 16 }}
					onChange={e => this.setState({ newType: e.target.value })}
					placeholder='Type'
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

export default LendableCreator
