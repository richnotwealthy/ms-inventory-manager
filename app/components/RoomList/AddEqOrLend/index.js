import React, {Component} from 'react'
import AddEqpmt from './AddEqpmt'
import Lend from './Lend'
import {Modal, Tabs} from 'antd'
const { TabPane } = Tabs

class AddEqOrLend extends Component {
	state = {
		currentTab: 'add'
	}

	render() {
		return (
			<Modal
				visible={this.props.visible}
				footer={null}
				onCancel={this.props.actions.hideAddEqOrLend}
				title={this.props.rid}
			>
				<Tabs
					activeKey={this.state.currentTab}
					onChange={currentTab => this.setState({ currentTab })}
					style={{ marginTop: -16 }}
				>
					<TabPane tab={'Add New Equipment'} key='add'>
						<AddEqpmt
							actions={{
								getAllEquipment: this.props.actions.getAllEquipment,
								getAllRooms: this.props.actions.getAllRooms,
								hideAddEqOrLend: this.props.actions.hideAddEqOrLend
							}}
							currentEqpmt={this.props.currentEqpmt}
							rid={this.props.rid}
						/>
					</TabPane>
					<TabPane tab={'Lend Equipment'} key='lend'>
						<Lend
							actions={{
								getAllLendables: this.props.actions.getAllLendables,
								hideAddEqOrLend: this.props.actions.hideAddEqOrLend
							}}
							rid={this.props.rid}
						/>
					</TabPane>
				</Tabs>
			</Modal>
		)
	}
}

export default AddEqOrLend
