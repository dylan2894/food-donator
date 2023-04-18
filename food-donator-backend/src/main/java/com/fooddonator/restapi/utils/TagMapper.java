package com.fooddonator.restapi.utils;

import java.util.Map;

import com.fooddonator.restapi.model.Tag;

public class TagMapper {
  
  private TagMapper(){}
  
  public static Tag mapTagJsonToTag(Map<String, String> map) {
    String tagID = map.get("id");
    String tagName = map.get("name");

    return new Tag(tagID, tagName);
  }
}
