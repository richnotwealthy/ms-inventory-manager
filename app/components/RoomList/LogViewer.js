import React, {Component} from 'react'
import {Modal, List, Tag} from 'antd'

class LogViewer extends Component {
	renderContent = () => (
		<List
			itemLayout='horizontal'
			dataSource={this.props.roomHistory}
			renderItem={log => (
				<List.Item>
					<List.Item.Meta
						title={
							<div>
								<span style={{ fontStyle: 'italic', marginRight: 16 }}>{(new Date(log.htimestamp)).toLocaleString()}</span>
								{log.hworkerList.map(w => (<Tag key={w}>{w}</Tag>))}
							</div>
						}
						description={log.hdescription}
					/>
				</List.Item>
			)}
		/>
	)

	render() {
		return (
			<Modal
				title={'Log History for ' + this.props.rid}
				visible={this.props.visible}
				footer={null}
				onCancel={this.props.actions.hideLogViewer}
			>
				{this.renderContent()}
			</Modal>
		)
	}
}

export default LogViewer
