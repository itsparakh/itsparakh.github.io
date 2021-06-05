import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, FormGroup, Label, Button, Col, Input, Card, CardBody, CardHeader } from 'reactstrap';

function App() {
  const [ siteData, setSiteData ] = useState(null);
  const [ keyword, setKeyword ] = useState(null);
  const [loader, setLoader ] = useState(false);

  const [formData, setFormData ] = useState({
    'url':'',
    'keyword':''
  })

  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({...formData,[name]:value });
  }

  const fetchHTML = async (url) => {
      let body ={
        'url' :formData.url,
        'keyword' :formData.keyword,
      }
      const result = await axios.post(url, body)
      setSiteData(result.data);
      setLoader(false);
  }

  const handleFormSubmit = (event) => {
      setLoader(true);
      event.preventDefault();
      fetchHTML(`http://localhost:3000/api/get/search`);
      setKeyword(formData.keyword);
  }

  return (
    <>
      <Container className="p-5">
          <h1 className="mb-4"> Site SearchTool</h1>
          <Form onSubmit={(e) => handleFormSubmit(e)}>
              <FormGroup row className="mb-3">
                <Label for="exampleEmail" sm={2}>Site URL</Label>
                <Col sm="6">
                  <Input type="text" name="url" id="exampleEmail" placeholder="Enter site url" onChange={(e)=> onFormInputChange(e)} required/>
                </Col>
              </FormGroup>
              <FormGroup row className="mb-3">
                <Label for="examplePassword" sm={2}>Keyword</Label>
                <Col sm="6">
                  <Input type="text" name="keyword" id="examplePassword" placeholder="Enter keyword" onChange={(e)=> onFormInputChange(e)} required/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Button color="primary" style={{width: '100px', marginLeft: '0.75rem'}}>Search</Button>
              </FormGroup>
          </Form>
          <Card className="mt-5">
            <CardHeader>
              Search result:
            </CardHeader>
            <CardBody>
              {!loader && siteData && siteData.pages &&
                <p>{`Crawled ${siteData.pages.totalPagesCount} pages. Found ${siteData.sentenceData.length > 0 ? siteData.pages.foundPagesCount:0} pages with the term ‘${keyword}’:`}</p>
               
              }
              {!loader && siteData && siteData.sentenceData &&
                  <>
                    {siteData.sentenceData.map((obj, index) => {
                        return <p key={index}>
                          - {obj}
                        </p>
                    })}
                    {siteData.sentenceData.length > 3 && <p>{'and more...'}</p>}
                  </>
              }
             {/*  {(siteData && siteData.bodyData) &&
                  <p>
                      {`Found ${siteData.bodyData.search(keyword) > 0 ?siteData.bodyData.search(keyword): 0} occurrences of the term '${keyword}'`}
                  </p>
              } */}
              {!loader && !(siteData && siteData.pages) &&
                  <p>
                      {'No result found'}
                  </p>
              }
              {loader &&
                 <div className="display-4 text-muted card p-0 border-0" style={{ opacity: '0.5', fontSize:'1.5rem' }}> Loading... </div>
              }
            </CardBody>
          </Card>
      </Container>
    </>
  );
}

export default App;
