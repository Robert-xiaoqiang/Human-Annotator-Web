import React, { Component } from 'react'
import { List, Rate, Typography, Divider, message } from 'antd';

import CandidateRate from '../../components/candidaterate'
import './index.css'
import api from '../../api';

const { Title, Paragraph, Text } = Typography;

export default class CandidateList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            authorizationCode: localStorage.getItem('authorizationCode'),
            data: [ ],
            currentPage: 1
        }
    }

    componentDidMount() {
        this.fetchCandidates();
    }

    handlePaginationChange = page => {
        this.setState({
            currentPage: page
        });
    }

    fetchCandidates = () => {
        const body = {
            authorizationCode: this.state.authorizationCode,
        };
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.allcandidates, {
            method: 'POST',
            body: bodyEncode,
            mode: 'cors'
        })
        .catch(err => {
            console.log(err);
            message.error('request error!');
        })
        .then(res => res.json())
        .then(res => {
            if(res.status) {
                this.setState({
                    data: res.data
                });
            } else {
                message.error(res.message);
            }
        });
    }


    render() {
      return (<List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: this.handlePaginationChange,
                    pageSize: 1,
                }}
                dataSource={this.state.data}
                footer={
                    <div>
                        <b>Page No. {this.state.currentPage}</b>
                    </div>
                }
                renderItem={sample => (<Typography key = { sample.model + sample.pk }>
                  <Paragraph>
                    <Title level = {4}>Answer span:</Title>
                    <Text>
                      {sample.fields.answer}
                    </Text>
                  </Paragraph>
                  <Paragraph>
                    <Title level = {4}>Context:</Title>
                    <Text>
                      {sample.fields.context}
                    </Text>
                  </Paragraph>
                  <Paragraph>
                    <Text strong = {true}>
                      Reference question:
                    </Text>
                    <Text>
                      {'  ' + sample.fields.question}
                    </Text>
                  </Paragraph>
                  <Paragraph>
                    <Title level = {4}>Candidate questions:</Title>
                  </Paragraph>
                  <Paragraph>
                    <ul>
                      {sample.fields.candidate_questions.map((candidate, index) => (<li>
                        <Text>
                          {candidate.fields.candidate_question}
                        </Text>
                        <CandidateRate candidatePk = {candidate.pk} key = {candidate.model + candidate.pk} />
                      </li>))}
                    </ul>
                  </Paragraph>
                  <Divider />
                </Typography>)}
              />)
  }
}