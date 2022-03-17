import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";

function HomePage() {
    return (
        <Segment inverted vertical textAlign='center' className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image 
                        size='massive' 
                        src='/assets/logo.png' 
                        alt='logo'
                        style={{ marginBottom: 12 }}
                    />
                    Reactivities
                </Header>
                <Header inverted as='h2' content='Welcome to Reactivities'/>
                <Button as={Link} to='/activities' size='huge' inverted>
                    Take me to the Activities!
                </Button>
            </Container>
        </Segment>
    );
}

export default HomePage;