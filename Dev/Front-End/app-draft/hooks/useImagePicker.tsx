import { usePermissions } from "expo-media-library";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker(){
  const [image, setImage] = useState<string | undefined>(undefined);
  const [mimeType, setMimeType] = useState<string | undefined>(undefined);
  const [status, requestPermission] = usePermissions();

  async function openImagePicker(){
    if(status === null){
      const permission = await requestPermission();
      if(permission.granted === false){
        alert("You need to grant permission to access your images");
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    })

    if(!result.canceled){
      setImage(result.assets[0].uri);
      setMimeType(result.assets[0].type);
    }
  }

  function reset() {
    setImage(undefined);
  }

  return { image, mimeType, openImagePicker, reset};
}