package com.fooddonator.restapi.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fooddonator.restapi.model.User;


import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import java.util.ArrayList;
import java.util.List;

@WebMvcTest(UserController.class)
public class UserControllerTests {
  @Autowired
  private MockMvc mvc; 

  @MockBean
  public UserController controller;

  // @Test
  // public void testGetAllDonors() throws Exception {
  //   List<Donor> arr = new ArrayList<>();
  //   arr.add(new Donor("someID", "nameHere", "phone_numHere", "-23", "23"));

  //   String out = "[{ \"id\": \"someID\", \"name\": \"nameHere\", \"phone_num\": \"phone_numHere\", \"coords\": { \"lat\": \"-23\", \"lon\": \"23\" }}]";

  //   //Mock
  //   given(this.controller.getDonors()).willReturn(arr);

  //   //Test
  //   this.mvc.perform(get("/donor/readAll"))
  //   .andExpect(status().isOk()).andExpect(content().json(out));
  // }

  // @Test
  // public void testGetOneDonor() throws Exception {
  //   Donor donor = new Donor("someID", "nameHere", "phone_numHere", "-23", "23");

  //   String out = "{ \"id\": \"someID\", \"name\": \"nameHere\", \"phone_num\": \"phone_numHere\", \"coords\": { \"lat\": \"-23\", \"lon\": \"23\" }}";

  //   //Mock
  //   given(this.controller.getDonor("someID")).willReturn(donor);

  //   //Test
  //   this.mvc.perform(get("/donor/readOne?id=\"someID\""))
  //   .andExpect(status().isOk()); 
  //   System.out.println(content().toString());
  // }

  // @Test
  // public void testUpdateDonor() throws Exception {
  //   Donor donor = new Donor("someID", "nameHere", "phone_numHere", "-23", "23");
  //   Donor updatedDonor = new Donor("someID", "newName", "phone_numHere", "-23", "23");
  //   String out = "{ \"id\": \"someID\", \"name\": \"nameHere\", \"phone_num\": \"phone_numHere\", \"coords\": { \"lat\": \"-23\", \"lon\": \"23\" }}";
  
  //   JSONObject obj = new JSONObject();
  //   obj.put("id", "someID");
  //   obj.put("name", "newName");
  //   obj.put("phone_num", "phone_numHere");
  //   JSONObject coords = new JSONObject();
  //   coords.put("lat", "-23");
  //   coords.put("lon", "23");
  //   obj.put("coords", coords);

  //   //Mock
  //   given(this.controller.updateDonor(donor)).willReturn(updatedDonor);

  //   //Test
  //   this.mvc.perform(post("/donor/update", "someID"))
  //   .andExpect(status().isOk()).andExpect(content().json(obj.toJSONString())); 
  // }


  /* Integration Tests */
  // @Test
  // public void testGetOneDonorIntegration() throws Exception {
  //   MvcResult MvcResult = this.mvc.perform(get("/donor/readOne?id=someID"))
  //   .andDo(print())
  //   .andExpect(status().isOk())
  //   //.andExpect(jsonPath("$.id").value("someID"))
  //   .andReturn();
  // }
}
