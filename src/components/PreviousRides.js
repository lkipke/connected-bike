import React from 'react';
import { Table, Heading, Pane, Text, Button } from 'evergreen-ui';

let PreviousRides = () => {
    let profiles = [{ id: 1, name: 'Levi', duration: '1234' }];
    return (
        <Table>
            <Table.Head>
                <Table.TextHeaderCell>name</Table.TextHeaderCell>
                <Table.TextHeaderCell>duration</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
                {profiles.map((profile) => (
                    <Table.Row
                        key={profile.id}
                        isSelectable
                        onSelect={() => alert(profile.name)}
                    >
                        <Table.TextCell>{profile.name}</Table.TextCell>
                        <Table.TextCell>{profile.duration}</Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export { PreviousRides };
