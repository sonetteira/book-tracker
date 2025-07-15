import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation() {
    return (
    <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="/">Book Tracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Finished Books</Nav.Link>
                    <Nav.Link href="/toread">Reading List</Nav.Link>
                    <Nav.Link href="/addBook">Add Book</Nav.Link>
                    {/* <NavDropdown title="Reports" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/yearlyReport">Yearly Report</NavDropdown.Item>
                        <NavDropdown.Item href="/">Yearly Books by Author</NavDropdown.Item>
                    </NavDropdown> */}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    );
}

export default Navigation;