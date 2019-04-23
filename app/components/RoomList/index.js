import React, {Component} from 'react'
import LogEditor from './LogEditor'
import LogViewer from './LogViewer'
import RoomCreator from './RoomCreator'
import RoomDeleter from './RoomDeleter'
import AddEqOrLend from './AddEqOrLend'
import axios from 'axios'
import _ from 'lodash'
import {Card, Collapse, Table, Icon, Button,
	Menu, Dropdown, Tag, Divider, Popconfirm, Input, Select} from 'antd'
const {Panel} = Collapse

const status = {
	G: <Icon style={{ fontSize: 20, color: '#52c41a' }} type="check-circle" />,
	Y: <Icon style={{ fontSize: 20, color: '#faad14' }} type="exclamation-circle" />,
	R: <Icon style={{ fontSize: 20, color: '#f5222d' }} type="close-circle" />
}

class RoomList extends Component {
	state = {
		eqpmtInRooms: {},
		lndblesInRooms: {},
		roomList: [],
		historyPerRoom: {},
		showLogEditor: false,
		showLogViewer: false,
		showRoomCreator: false,
		showRoomDeleter: false,
		showAddEqOrLend: false,
		currentRoom: null,
		roomFilter: '',
		statusFilter: []
	}

	getAllEquipment = () => {
		axios.get('/db/get/equipment').then(res => {
				// group equipment by room id
				this.setState({ eqpmtInRooms: _.groupBy(res.data, 'rid') })
			}
		)
	}

	getAllLendables = () => {
		axios.get('/db/get/lendables').then(res => {
				// group equipment by room id
				this.setState({ lndblesInRooms: _.groupBy(res.data, 'rid') })
			}
		)
	}

	getAllRooms = () => {
		axios.get('/db/get/rooms').then(res => {
				this.setState({ roomList: res.data })
			}
		)
	}

	getAllHistory = () => {
		axios.get('/db/get/history').then(res => {
			// group history by room id
			this.setState({ historyPerRoom: _.groupBy(res.data, 'rid') })
			}
		)
	}

	componentDidMount() {
		this.getAllRooms()
		this.getAllEquipment()
		this.getAllLendables()
		this.getAllHistory()
	}

	handleStatusUpdate = eq => {
		return e => {
			const newEqStatus = e.key

			let newRoomStatus = newEqStatus

			// if we are changing something to red, room is red at best
			if (newRoomStatus !== 'R') {
				const eqpmtInThisRoom = this.state.eqpmtInRooms[eq.rid]
				for (let i = 0; i < eqpmtInThisRoom.length; i++) {
					// don't look at old data
					if (eq.etype !== eqpmtInThisRoom[i].etype) {
						if (eqpmtInThisRoom[i].estatus === 'Y' && newRoomStatus !== 'R')
							newRoomStatus = 'Y'
						else if (eqpmtInThisRoom[i].estatus === 'R') {
							newRoomStatus = 'R'
							break // red found, can break
						}
					}
				}
			}

			axios.post('/db/set/equipment', {
				rid: eq.rid,
				etype: eq.etype,
				estatus: newEqStatus
			}).then(res => {
        this.updateRoomStatus(eq.rid, newRoomStatus)
			})
		}
	}

  handleRoomStatusUpdate = rid => {
    return e => {
      const newRoomStatus = e.key
      this.updateRoomStatus(rid, newRoomStatus)
    }
  }

  updateRoomStatus = (rid, newRoomStatus) => {
    axios.post('/db/set/room', {
      rid,
      rstatus: newRoomStatus
    }).then(res => {
      this.getAllRooms()
      this.getAllEquipment()
    })
  }

	removeLndble = lid => {
		axios.post('/db/set/lendable/room', {
			lid,
			rid: null
		}).then(res => {
			this.getAllLendables()
		})
	}

	removeEqpmt = eqpmt => {
		return () => {
			let newRoomStatus = 'G' // start as green this time

			// need to update room status again
			const eqpmtInThisRoom = this.state.eqpmtInRooms[eqpmt.rid]
			for (let i = 0; i < eqpmtInThisRoom.length; i++) {
				// don't look at old data
				if (eqpmt.etype !== eqpmtInThisRoom[i].etype) {
					if (eqpmtInThisRoom[i].estatus === 'Y' && newRoomStatus !== 'R')
						newRoomStatus = 'Y'
					else if (eqpmtInThisRoom[i].estatus === 'R') {
						newRoomStatus = 'R'
						break // red found, can break
					}
				}
			}

			axios.post('/db/delete/equipment', eqpmt).then(res => {
				this.updateRoomStatus(eqpmt.rid, newRoomStatus)
			})
		}
	}

	renderLndbleTable = (rid) => {
		let { lndblesInRooms } = this.state

		if (!lndblesInRooms[rid] || lndblesInRooms[rid].length === 0)
			return null

		const lndbleColumns = [
			{
				title: 'Identifier',
				dataIndex: 'lid',
				key: 'lid',
				render: txt => (
					<span style={{ fontStyle: 'italic' }}>{txt}</span>
				)
			},
			{
				title: 'Action',
				key: 'operation',
				fixed: 'right',
				width: 200,
				render: lndble => (
					<Popconfirm
						title='Are you sure?'
						onConfirm={() => this.removeLndble(lndble.lid)}
						okText='Return'
						okType='danger'
						cancelText='Cancel'
					>
						<Button
							icon='loading'
							type='danger'
						>
							Return Item
						</Button>
					</Popconfirm>
				)
			}
		]

		return (
			<Table
				showHeader={false}
				pagination={false}
				columns={lndbleColumns}
				dataSource={lndblesInRooms[rid]}
				rowKey='lid'
			/>
		)
	}

	renderRooms = () => {
		let { eqpmtInRooms, roomList, historyPerRoom, roomFilter, statusFilter } = this.state

		// filter by rid
		roomList = roomList.filter(({ rid }) =>
			rid.toLowerCase().indexOf(roomFilter.toLowerCase()) > -1
		)

		// filter by rstatus
		if (statusFilter.length != 0) {
			roomList = roomList.filter(room =>
				statusFilter.includes(room.rstatus)
			)
		}

		const menu = eq => (
			<Menu onClick={this.handleStatusUpdate(eq)}>
				<Menu.Item key='G' name='G'>Healthy</Menu.Item>
		    <Menu.Item key='Y' name='Y'>Usable</Menu.Item>
		    <Menu.Item key='R' name='R'>Broken</Menu.Item>
			</Menu>
		)

		const eqpmtColumns = [
			{
				title: 'Type',
				dataIndex: 'etype',
				key: 'etype'
			},
			{
				title: 'Status',
				dataIndex: 'estatus',
				key: 'estatus',
				render: s => status[s]
			},
			{
				title: 'Action',
				key: 'operation',
				fixed: 'right',
				width: 200,
				render: eqpmt => (
					<Button.Group>
						<Dropdown trigger={['click']} overlay={menu(eqpmt)}>
							<Button>Update<Icon type="down" /></Button>
						</Dropdown>
						<Popconfirm
							title='Are you sure?'
							onConfirm={this.removeEqpmt(eqpmt)}
							okText='Delete'
							okType='danger'
							cancelText='Cancel'
						>
							<Button icon='delete' type='dashed' />
						</Popconfirm>
					</Button.Group>
				)
			}
		]

		return roomList.map((r, i) => {
			const header = (
				<div>
					<span>{r.rid}</span>
					<span style={{ float: 'right', marginRight: 20 }}>{status[r.rstatus]}</span>
				</div>
			)

			const mostRecentLog = (historyPerRoom[r.rid] || [{
				hdescription: 'No historical logs available :(',
				hworkerList: [],
				htimestamp: "2016-02-29T17:30:00.000Z" // issa my media support start date :))
			}])[0]

			return (
				<Panel key={r.rid} header={header}>
					<Button.Group style={{ marginTop: 8 }} size='small'>
						<Button
							icon='plus'
							style={{ marginLeft: 16 }}
							onClick={() => this.setState({ showAddEqOrLend: true, currentRoom: r.rid })}
						>
							Equipment
						</Button>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu onClick={this.handleRoomStatusUpdate(r.rid)}>
          				<Menu.Item key='G' name='G'>Healthy</Menu.Item>
          		    <Menu.Item key='Y' name='Y'>Usable</Menu.Item>
          		    <Menu.Item key='R' name='R'>Broken</Menu.Item>
          			</Menu>
              }
              style={{ marginLeft: 16 }}
            >
							<Button>Update<Icon type="down" /></Button>
						</Dropdown>
					</Button.Group>
          <Divider style={{ marginBottom: -1 }} />
					{this.renderLndbleTable(r.rid)}
					<Table
						showHeader={false}
						pagination={false}
						columns={eqpmtColumns}
						dataSource={eqpmtInRooms[r.rid]}
						rowKey='etype'
						footer={() => (
							<div>
								<span style={{ fontStyle: 'italic', marginRight: 16 }}>{(new Date(mostRecentLog.htimestamp)).toLocaleString()}</span>
								{mostRecentLog.hworkerList.map(w => (<Tag key={w}>{w}</Tag>))}
								<p style={{ marginTop: 6 }}>
									{mostRecentLog.hdescription}
								</p>
								<Button onClick={() => this.setState({ showLogEditor: true, currentRoom: r.rid })} icon='edit' type='primary'>Add to Log</Button>
								<Button onClick={() => this.setState({ showLogViewer: true, currentRoom: r.rid })} style={{ float: 'right' }} icon='book'>View Past Logs</Button>
							</div>
						)}
					/>
				</Panel>
			)
		})
	}

	render() {
		return (
			<div>
				<Card title={(
						<div>
							<span>{this.props.title}</span>
							<Input
								style={{ marginLeft: 16, width: '20%' }}
								placeholder='ID'
								value={this.state.roomFilter}
								onChange={e => this.setState({ roomFilter: e.target.value })}
							/>
							<Button.Group style={{ float: 'right' }}>
								<Button
									icon='plus'
									size='small'
									onClick={() => this.setState({ showRoomCreator: true })}
								/>
								<Button
									icon='minus'
									size='small'
									onClick={() => this.setState({ showRoomDeleter: true })}
								/>
							</Button.Group>
							<span style={{ marginLeft: 16 }}>Status</span>
							<Select
								mode='multiple'
								style={{ marginLeft: 16, width: '30%' }}
								placeholder='Status'
								value={ this.state.statusFilter }
								onChange={e => this.setState({ statusFilter: e})}
							>
								{[
									<Select.Option key='G'>Healthy</Select.Option>,
									<Select.Option key='Y'>Working</Select.Option>,
									<Select.Option key='R'>Broken</Select.Option>
								]}
							</Select>
						</div>
					)}
				>
					<Collapse>
						{this.renderRooms()}
					</Collapse>
				</Card>
				<LogEditor
					actions={{
						getAllHistory: this.getAllHistory,
						hideLogEditor: () => this.setState({ showLogEditor: false })
					}}
					rid={this.state.currentRoom}
					visible={this.state.showLogEditor}
				/>
				<LogViewer
					actions={{
						hideLogViewer: () => this.setState({ showLogViewer: false })
					}}
					rid={this.state.currentRoom}
					roomHistory={this.state.historyPerRoom[this.state.currentRoom]}
					visible={this.state.showLogViewer}
				/>
				<RoomCreator
					actions={{
						getAllRooms: this.getAllRooms,
						hideRoomCreator: () => this.setState({ showRoomCreator: false })
					}}
					visible={this.state.showRoomCreator}
				/>
				<RoomDeleter
					actions={{
						getAllRooms: this.getAllRooms,
						hideRoomDeleter: () => this.setState({ showRoomDeleter: false })
					}}
					allRooms={this.state.roomList}
					visible={this.state.showRoomDeleter}
				/>
				<AddEqOrLend
					actions={{
						getAllEquipment: this.getAllEquipment,
						getAllRooms: this.getAllRooms,
						getAllLendables: this.getAllLendables,
						hideAddEqOrLend: () => this.setState({ showAddEqOrLend: false })
					}}
					currentEqpmt={this.state.eqpmtInRooms[this.state.currentRoom]}
					visible={this.state.showAddEqOrLend}
					rid={this.state.currentRoom}
				/>
			</div>
		)
	}
}

export default RoomList
