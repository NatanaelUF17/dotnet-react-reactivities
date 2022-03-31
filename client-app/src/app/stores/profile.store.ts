import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo } from "../models/photo";
import { Profile } from "../models/profile";
import { store } from "./store";

class ProfileStore {
  profile: Profile | null = null;
  isUpdatingProfile: boolean = false;
  isLoadingProfile: boolean = false;
  isUploading: boolean = false;
  isSettingMainPhoto: boolean = false;
  isDeletingPhoto: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    this.isLoadingProfile = true;
    try {
        const profile = await agent.Profiles.get(username);
        runInAction(() => {
            this.profile = profile;
            this.isLoadingProfile = false;
        })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.isLoadingProfile = false;
      });
    }
  }

  updateProfile = async (profile: Partial<Profile>) => {
    this.isUpdatingProfile = true;
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
          store.userStore.setDisplayName(profile.displayName);
        }
        this.profile = {...this.profile, ...profile as Profile};
        this.isUpdatingProfile = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.isUpdatingProfile = false;
      });
    }
  }

  uploadPhoto = async (file: Blob) => {
    this.isUploading = true;
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.isUploading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.isUploading = false;
      });
    }
  }

  setMainPhoto = async (photo: Photo) => {
    this.isSettingMainPhoto = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos)  {
          this.profile.photos.find(p => p.isMain)!.isMain = false;
          this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.isSettingMainPhoto = false;
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.isSettingMainPhoto = false;
      });
    }
  }

  deletePhoto = async (photo: Photo) => {
    this.isDeletingPhoto = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
          this.isDeletingPhoto = false;
        }
      });
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.isDeletingPhoto = false;
      })
    }
  }
}

export default ProfileStore;
