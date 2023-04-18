package com.fooddonator.restapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTag {
  final String tagid;
  final String donationid;
}