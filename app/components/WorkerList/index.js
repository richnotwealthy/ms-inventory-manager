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
