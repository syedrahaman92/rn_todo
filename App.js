import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, Alert, Button, Picker } from 'react-native';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    this.getTodoItems().done();
  }
  async getTodoItems() {
  try {
    let response = await fetch(
      'https://immense-mountain-14224.herokuapp.com/todoitems'
    );
    let responseJson = await response.json();
    let mov = responseJson.result;
    this.setState({
      isLoading: false,
      dataSource: responseJson.result,
    });
  } catch (error) {
    console.error(error);
  }
}
  render() {
    let pic = {
      uri: 'http://www.gstatic.com/webp/gallery/5.jpg'
    };
    let pic1 = {
      uri: 'http://www.gstatic.com/webp/gallery/2.jpg'
    };
    let pic2 = {
      uri: 'http://www.gstatic.com/webp/gallery/1.jpg'
    };
    let pic3 = {
      uri: 'https://www.gstatic.com/webp/gallery3/1_webp_ll.png'
    };
    if(this.state.isAddTodo){
      return(
        <View style={styles.container}>
          <View style={styles.header}>
            <Text>Todo App</Text>
          </View>
          <Text style={styles.subheader}>New Todo Item</Text>
          <View style={{padding: 10}}>
              <TextInput
                style={styles.inputField}
                placeholder="Task Name"
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Task"
                onChangeText={(task) => this.setState({task})}
                value={this.state.task}
              />
              <Picker
                selectedValue={this.state.status}
                style={styles.inputPick}
                onValueChange={(itemValue, itemIndex) => this.setState({status: itemValue})}>
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Processing" value="Processing" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>
            <View style={styles.buttonContainer}>
            <Button
              onPress={ async () => {
                //alert("name: " + this.state.name + "Task: " + this.state.task + "Status: " + this.state.status)
                try{
                    let sendData = await fetch('https://immense-mountain-14224.herokuapp.com/todoitem', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: this.state.name,
                      task: this.state.task,
                      status: this.state.status,
                    }),
                  });
                  let responseData = await sendData.json();
                  alert(responseData.result)
                  this.setState({
                    isAddTodo: false,
                  });
                }catch (error) {
                  console.error(error);
                }
              }
            }
              title="Done"
            />
          </View>
        </View>
      )
    }
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 60}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Todo App</Text>
        </View>
        <Image source = {pic} style = {{width: 360, height: 110}}/>
        <Text style={styles.subheader}>Todo list</Text>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <View style={styles.itemList}>
            <Text style={styles.item}><Image source = {(item.Status == 'Completed') ? pic1 : (item.Status == 'Processing') ? pic2 : pic3} style = {styles.itemImage}/></Text>
            <Text style={styles.item}>{item.Name}</Text>
            <Text style={styles.item}>{item.Task}</Text>
            <Text style={styles.item}>{item.Status}</Text>
          </View>
          }
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              this.setState({
                isAddTodo: true,
              });
            }}
            title="ADD"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    paddingTop: 22,
  },
  header: {
    width: 360,
    height: 50,
    backgroundColor: '#72fffc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subheader: {
    width: 360,
    height: 20,
    backgroundColor: '#000',
    color: '#fff',
    textAlign: 'center',
  },
  itemList: {
    padding: 10,
    //height: 44,
    borderColor: '#d6d7da',
    borderWidth: 0.5,
    borderRadius: 4,
    flexDirection: 'row',
  },
  item: {
    fontSize: 14,
    width: 90,
  },
  itemImage: {
    width: 70,
    height: 60,
  },
   buttonContainer: {
    width: 360,
    height: 50,
  },
  inputField: {
    height: 50,
    borderColor: '#d6d7da',
    borderRadius: 5,
  },
  inputPick: {
     height: 50,
     width: 350,
  }
});
