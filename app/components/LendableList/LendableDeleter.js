import React, {Component} from 'react'
import axios from 'axios'
import {Modal, Select, message} from 'antd'
const { Option } = Select

class LendableDeleter extends Component {
	state = {
		selectedLid: undefined
	}

	handleOk = () => {
		if (!this.state.selectedLid) {
			message.error('Select a lendable to delete!')
			return
		}

		axios.post('/db/delete/lendable', {
			lid: this.state.selectedLid,
		}).then(res => {
			// reset values
			this.setState({
				selectedLid: undefined
			})

			// refresh parent
			this.props.actions.getAllLendables()
			this.props.actions.hideLendableDeleter()
		})
	}

	render() {
		return (
			<Modal
				title={'Delete Lendable'}
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.props.actions.hideLendableDeleter}
				okText='Delete'
				okType='danger'
			>
				<Select
					style={{ width: '100%' }}
					value={this.state.selectedLid}
					onChange={selectedLid => this.setState({ selectedLid })}
					placeholder='Select Lendable to Delete'
					showSearch
					filterOption={(val, e) => e.props.children.toLowerCase().indexOf(val.toLowerCase()) > -1}
				>
					{this.props.allLendables.map(lndble => (
						<Option key={lndble.lid}>{lndble.lid + ' - ' + lndble.ltype}</Option>
					))}
				</Select>
			</Modal>
		)
	}
}

export default LendableDeleter
