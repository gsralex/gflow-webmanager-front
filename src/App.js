import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';
import { Link } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
class App extends Component {

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload1.
      //     </p>
      //       <div>
      //         <ul>
      //           <li><Link to="/demo1">Demo1</Link></li>
      //           <li><Link to="/demo2">Demo2</Link></li>
      //         </ul>
      //         <hr/>
      //         {this.props.children}
      //       </div>

      //   </header>
      // </div>
    <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
            <Link to='/saveaction'>
              <Icon type="pie-chart" />
              <span>save action</span></Link>
            </Menu.Item>
            <Menu.Item key="2">
            <Link to='/actionlist'>
              <Icon type="desktop" />
              <span>action list</span></Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {this.props.children}
          </Content>
        </Layout>
      </Layout>

    );
  }
}

export default App;
