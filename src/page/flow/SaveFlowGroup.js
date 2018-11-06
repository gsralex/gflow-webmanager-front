import React, { Component } from 'react';
import { Layout, Divider, List, Avatar } from 'antd';
import { Card } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

export default class SaveFlowGroup extends Component {
    data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];
    render() {
        const _this = this;
        return (
            <Layout>
                <Sider style={{ background: '#fff', width: 400 }}>
                    <List
                        bordered={false}
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={this.data}
                        renderItem={item => (
                            <List.Item>
                                <div>
                                    {item.title}
                                </div>
                            </List.Item>
                        )}
                    />
                </Sider>
                <Content>
                    <svg id="svg2" width="100%" height="620">
                        <circle
                            id="circle1"
                            cx="300"
                            cy="200"
                            r="100"
                            stroke="black"
                            strokeWidth="1"
                            fill="#EED5D2"
                        />
                    </svg>

                </Content>
            </Layout>
        )
    }
}