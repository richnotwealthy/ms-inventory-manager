import React, {Component} from 'react'
import WorkerCreator from './WorkerCreator'
import WorkerDeleter from './WorkerDeleter'
import axios from 'axios'
import {Card, List, Button, Avatar} from 'antd'

class WorkerList extends Component {
	state = {
		allWorkers: [],
		showWorkerCreator: false,
		showWorkerDeleter: false
	}

	getAllWorkers = () => {
		axios.get('/db/get/workers').then(res => {
			this.setState({ allWorkers: res.data })
		})
	}

	componentDidMount() {
		this.getAllWorkers()
	}

	renderWorkerList = () => {
		return (
			<List
				itemLayout='horizontal'
				dataSource={this.state.allWorkers}
				renderItem={worker => (
					<List.Item>
						<List.Item.Meta
							avatar={<Avatar>{worker.wname[0]}</Avatar>}
							title={(<span style={{ fontWeight: 'bold' }}>{worker.wname}</span>)}
						/>
						<span style={{ fontStyle: 'italic' }}>{worker.netid}</span>
					</List.Item>
				)}
			/>
		)
	}

	render() {
		return (
			<div>
				<Card title={(
						<div>
							<span>{this.props.title}</span>
							<Button.Group style={{ float: 'right' }}>
								<Button
									icon='plus'
									size='small'
									onClick={() => this.setState({ showWorkerCreator: true })}
								/>
								<Button
									icon='minus'
									size='small'
									onClick={() => this.setState({ showWorkerDeleter: true })}
								/>
							</Button.Group>
						</div>
					)}
				>
					{this.renderWorkerList()}
				</Card>
				<WorkerCreator
					actions={{
						getAllWorkers: this.getAllWorkers,
						hideWorkerCreator: () => this.setState({ showWorkerCreator: false })
					}}
					visible={this.state.showWorkerCreator}
				/>
				<WorkerDeleter
					actions={{
						getAllWorkers: this.getAllWorkers,
						hideWorkerDeleter: () => this.setState({ showWorkerDeleter: false })
					}}
					allWorkers={this.state.allWorkers}
					visible={this.state.showWorkerDeleter}
				/>
			</div>
		)
	}
}

export default WorkerList
