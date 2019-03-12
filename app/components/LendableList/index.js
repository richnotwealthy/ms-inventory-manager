import React, {Component} from 'react'
import LendableCreator from './LendableCreator'
import LendableDeleter from './LendableDeleter'
import axios from 'axios'
import {Card, Button} from 'antd'

class LendableList extends Component {
	state = {
		allLendables: [],
		showLendableCreator: false,
		showLendableDeleter: false
	}

	getAllLendables = () => {
		axios.get('/db/get/lendables').then(res => {
			this.setState({ allLendables: res.data })
		})
	}

	componentDidMount() {
		this.getAllLendables()
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
									onClick={() => this.setState({ showLendableCreator: true })}
								/>
								<Button
									icon='minus'
									size='small'
									onClick={() => this.setState({ showLendableDeleter: true })}
								/>
							</Button.Group>
						</div>
					)}
				>
				</Card>
				<LendableCreator
					actions={{
						getAllLendables: this.getAllLendables,
						hideLendableCreator: () => this.setState({ showLendableCreator: false })
					}}
					visible={this.state.showLendableCreator}
				/>
				<LendableDeleter
					actions={{
						getAllLendables: this.getAllLendables,
						hideLendableDeleter: () => this.setState({ showLendableDeleter: false })
					}}
					allLendables={this.state.allLendables}
					visible={this.state.showLendableDeleter}
				/>
			</div>
		)
	}
}

export default LendableList
