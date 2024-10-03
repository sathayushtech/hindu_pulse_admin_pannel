import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminpageService } from '../adminpage.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';


import { catchError, of, forkJoin } from 'rxjs';




@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,NzUploadModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  constructor(private adminservice:AdminpageService, private router: Router){}
  
  

editedNewsItem: {
  headline?: string;
  audio_location?: string;
  desc?: string;
  short_description?:string;
  link?: string;
  url?: string;
  category_id?: string;
  news_sub_category_id?: string;
  image_location:string[];
  location?: string;
  status?: string; 
} = {
  // image_location: [] 
  image_location: [], // Initialize as an empty array
  audio_location: '' // Initialize as an empty string
};

medianews: any = [];
news: any;
ids: any = [];
// isEditingId: string | null = null;
isEditingId: any;
productiondata: any = [];
categories: any;
subCategories: any;
selectedCategoryId: string | null = null;
filteredSubCategories: any[] = [];
canMove: boolean = false; 
bannerFileList: NzUploadFile[] = [];
showFileInput: { [key: string]: boolean } = {};
loading: boolean = false;
audio_location:any;




ngOnInit() {
  this.fetchnews();
  this.productionnews();
  this.fetchCategories();
  this.fetchSubCategories();
  
  const storedVisitedNews = localStorage.getItem('visitedNews');
  if (storedVisitedNews) {
    this.visitedNews = JSON.parse(storedVisitedNews);
  }
}



currentPage: number = 1;
pageSize: number = 50;



fetchnews(pageNumber: number = 1, pageSize: number = 50): void {
  this.adminservice.Getdata(pageNumber, pageSize).subscribe(
    data => {
      if (data.results && data.results.length > 0) {
        this.medianews = data.results;
        console.log("fetched datafffffffff", this.medianews);
        this.ids = this.medianews.map((news: any) => news._id);
        this.medianews.forEach((news: any) => news.moved = false);
      } else {
        
        this.currentPage--;
      }
    },
    error => {
      console.error("Error fetching data", error);
     
      this.currentPage--;
    }
  );
}

loadPage(pageNumber: number): void {
  if (pageNumber > 0) { 
    this.currentPage = pageNumber;
    console.log("page numbers", this.currentPage);
    this.fetchnews(this.currentPage, this.pageSize);
  }
}



transfer(id: string): void {
  const itemToTransfer = this.medianews.find((news: any) => news._id === id);

  if (itemToTransfer) {
    if (itemToTransfer.status === 'SUCCESS') {
      this.adminservice.transferData(id).subscribe(
        response => {
          console.log('Data transferred successfully:', response);
          this.fetchnews(); 
          
          
          if (!this.visitedNews.includes(id)) {
            this.visitedNews.push(id);
            localStorage.setItem('visitedNews', JSON.stringify(this.visitedNews)); 
          }
        },
        error => {
          console.error('Error transferring data:', error);
        }
      );
    } else {
      alert('Item cannot be transferred because its status is not "SUCCESS".');
    }
  } else {
    console.error('Item not found for transfer:', id);
  }
}

startEditing(newsItem: any): void {
  this.isEditingId = newsItem._id;
  this.editedNewsItem = { 
    ...newsItem,
    image_location: Array.isArray(newsItem.image_location) ? newsItem.image_location : [newsItem.image_location || ''],
    audio_location: newsItem.audio_location || '', // Store audio as a string
    category: newsItem.category_id || null,
    subcategory: newsItem.news_sub_category_id || null
  };
  this.showFileInput[this.isEditingId] = !newsItem.image_location || newsItem.image_location.length === 0;
}





// saveChanges(): void {
//   if (this.isEditingId) {
//     const currentNews = this.medianews.find((news: any) => news._id === this.isEditingId);

//     if (currentNews) {
//       const updateItem = {
//         headline: this.editedNewsItem.headline || currentNews.headline,
//         desc: this.editedNewsItem.desc || currentNews.desc,
//         short_description: this.editedNewsItem.short_description || currentNews.short_description,
//         link: currentNews.link,
//         url: currentNews.url,
//         category_id: this.editedNewsItem.category_id || currentNews.category_id,
//         news_sub_category_id: this.editedNewsItem.news_sub_category_id || currentNews.news_sub_category_id,
//         image_location: this.editedNewsItem.image_location && this.editedNewsItem.image_location.length > 0
//           ? this.editedNewsItem.image_location
//           : currentNews.image_location,
//         audio_location: this.editedNewsItem.audio_location || currentNews.audio_location, // Use the extracted base64 string
//         location: this.editedNewsItem.location || currentNews.location,
//         status: this.editedNewsItem.status || currentNews.status
//       };

//       this.adminservice.updateNews(this.isEditingId, updateItem).subscribe(
//         response => {
//           console.log('News updated successfully:', response);
//           this.fetchnews(); 
          
//           this.isEditingId = null;
//           this.canMove = true;
//         },
//         error => {
//           console.error('Error updating news:', error);
//         }
//       );
//     } else {
//       console.error('News item not found for editing.');
//     }
//   }
// }

savedNews: any[] = []; 

// saveChanges(): void {
//   if (this.isEditingId) {
//     const currentNews = this.medianews.find((news: any) => news._id === this.isEditingId);

//     if (currentNews) {
//       const updateItem = {
//         headline: this.editedNewsItem.headline || currentNews.headline,
//         desc: this.editedNewsItem.desc || currentNews.desc,
//         short_description: this.editedNewsItem.short_description || currentNews.short_description,
//         link: currentNews.link,
//         url: currentNews.url,
//         category_id: this.editedNewsItem.category_id || currentNews.category_id,
//         news_sub_category_id: this.editedNewsItem.news_sub_category_id || currentNews.news_sub_category_id,
//         image_location: this.editedNewsItem.image_location && this.editedNewsItem.image_location.length > 0
//           ? this.editedNewsItem.image_location
//           : currentNews.image_location,
//         audio_location: this.editedNewsItem.audio_location || currentNews.audio_location,
//         location: this.editedNewsItem.location || currentNews.location,
//         status: this.editedNewsItem.status || currentNews.status
//       };

//       this.adminservice.updateNews(this.isEditingId, updateItem).subscribe(
//         response => {
//           console.log('News updated successfully:', response);
//           this.fetchnews();
          
//           // Highlight the updated news item
//           this.savedNews.push(this.isEditingId); // Push the edited news ID
//           localStorage.setItem('savedNews', JSON.stringify(this.savedNews));
//           this.isEditingId = null;
//           this.canMove = true;

//           // Reset the highlighted news item after a timeout (optional)
//           setTimeout(() => {
//             this.savedNews = this.savedNews.filter(id => id !== this.isEditingId); // Remove the highlight
//           }, 2000); // Adjust the duration as needed
//         },
//         error => {
//           console.error('Error updating news:', error);
//         }
//       );
//     } else {
//       console.error('News item not found for editing.');
//     }
//   }
// }

saveChanges(): void {
  if (this.isEditingId) {
    const currentNews = this.medianews.find((news: any) => news._id === this.isEditingId);

    if (currentNews) {
      const updateItem = {
        headline: this.editedNewsItem.headline || currentNews.headline,
        desc: this.editedNewsItem.desc || currentNews.desc,
        short_description: this.editedNewsItem.short_description || currentNews.short_description,
        link: currentNews.link,
        url: currentNews.url,
        category_id: this.editedNewsItem.category_id || currentNews.category_id,
        news_sub_category_id: this.editedNewsItem.news_sub_category_id || currentNews.news_sub_category_id,
        image_location: this.editedNewsItem.image_location && this.editedNewsItem.image_location.length > 0
          ? this.editedNewsItem.image_location
          : currentNews.image_location,
        audio_location: this.editedNewsItem.audio_location || currentNews.audio_location,
        location: this.editedNewsItem.location || currentNews.location,
        status: this.editedNewsItem.status || currentNews.status
      };

      this.adminservice.updateNews(this.isEditingId, updateItem).subscribe(
        response => {
          console.log('News updated successfully:', response);
          this.fetchnews(); 

          // Highlight the updated news item
          this.savedNews.push(this.isEditingId); // Push the edited news ID
          localStorage.setItem('savedNews', JSON.stringify(this.savedNews)); // Save to localStorage
          this.isEditingId = null;
          this.canMove = true;
        },
        error => {
          console.error('Error updating news:', error);
        }
      );
    } else {
      console.error('News item not found for editing.');
    }
  }
}


cancelEdit(): void {
  this.isEditingId = null;
  this.editedNewsItem = { image_location: [] };
}


deleteNews(id: any): void {
  this.adminservice.deleteNews(id).subscribe(
    response => {
      console.log('News deleted successfully:', response);
      this.fetchnews();
    },
    error => {
      console.error('Error deleting news:', error);
    }
  );
}

currentProductionPage: number = 1;
productionPageSize: number = 10;


productionnews(pageNumber: number = 1, pageSize: number = 10): void {
  this.adminservice.productionnews(pageNumber, pageSize).subscribe(
    data => {
      if (data.results && data.results.length > 0) {
        this.productiondata = data.results;
        console.log("Fetched production data", this.productiondata);
      } else {
       
        this.currentProductionPage--;
      }
    },
    error => {
      console.error("Error fetching production data", error);

      this.currentProductionPage--;
    }
  );
}

loadProductionPage(pageNumber: number): void {
  if (pageNumber > 0) {
    this.currentProductionPage = pageNumber;
    console.log("Production page number", this.currentProductionPage);
    this.productionnews(this.currentProductionPage, this.productionPageSize);
  }
}



toggleSelectAll(event: any): void {
  const isChecked = event.target.checked;
  this.medianews.forEach((news:any) => news.selected = isChecked);
}




visitedNews:any;

moveSelected(): void {
  const selectedItems = this.medianews.filter((news: any) => news.selected);
  selectedItems.forEach((item: any) => {
    this.adminservice.transferData(item._id).subscribe(
      response => {
        console.log('Data transferred successfully:', response);
        this.fetchnews(); 
        // Add the moved item to the visitedNews array
        this.visitedNews.push(item._id);
        localStorage.setItem('visitedNews', JSON.stringify(this.visitedNews));
      },
      error => {
        console.error('Error transferring data:', error);
      }
    );
  });
}

  
  

deleteSelected(): void {
  const selectedItems = this.medianews.filter((news: any) => news.selected);
  selectedItems.forEach((item: any) => {
    this.adminservice.deleteNews(item._id).subscribe(
      response => {
        console.log('News deleted successfully:', response);
        this.fetchnews();
      },
      error => {
        console.error('Error deleting news:', error);
      }
    );
  });
}


deleteProduction(id: any): void {
  if (confirm('Are you sure you want to delete this production data?')) {
    this.adminservice.deleteFromProduction(id).subscribe(
      response => {
        console.log('Production data deleted successfully:', response);
        this.productionnews();
      },
      error => {
        console.error('Error deleting production data:', error);
      }
    );
  }
}

undoFromProductiondb(id: any): void {
  if (confirm('Are you sure you want to perform the undo?')) {
    this.adminservice.UndoFromProduction(id).subscribe(
      response => {
        console.log('Production data deleted successfully:', response);
        this.productionnews();
      },
      error => {
        console.error('Error deleting production data:', error);
      }
    );
  }
}




fetchCategories(): void {
  this.adminservice.getCategories().subscribe(
    data => {
      this.categories = data;
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}

fetchSubCategories(): void {
  this.adminservice.getSubCategories().subscribe(
    (data: any) => {  
      this.subCategories = data.results; 
    },
    error => {
      console.error('Error fetching subcategories:', error);
    }
  );
}

getCategoryName(id: string): string {
  const category = this.categories.find((cat: any) => cat._id === id);
  return category ? category.name : 'No category';
}

getSubCategoryName(id: string): string {
  const subCategory = this.subCategories.find((subCat: any) => subCat._id === id);
  return subCategory ? subCategory.name : 'No subcategory';
}

onCategoryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedCategoryId = target.value;
  this.fetchSubCategoriesByCategoryId(this.selectedCategoryId);
}


fetchSubCategoriesByCategoryId(categoryId: string): void {
  this.adminservice.getSubcategoriesbyId(categoryId).subscribe(
    (data: any) => {
      this.filteredSubCategories = data.results;
    },
    error => {
      console.error('Error fetching subcategories by category ID:', error);
    }
  );
}


onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    console.log('Selected file:', file);

  }
}


handleBannerFileChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'bannerImage');
}


handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];
  const base64List: string[] = []; 

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      base64List.push(base64String); 
      this.editedNewsItem.image_location= base64List;
    });
  });

  // this.editedNewsItem.image_location.get(formControlName)?.setValue(fileList);
  if (formControlName === 'images') {
    this.bannerFileList = fileList;
  } else if (formControlName === 'bannerImage') {
    this.bannerFileList = fileList;
  }
}


getBase64(file: File, callback: (base64String: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => {
    let base64String = reader.result as string;
    base64String = base64String.split(',')[1];
    console.log("string convention data", base64String)
    callback(base64String);
    
  };
  reader.readAsDataURL(file);
}



// audioFileList: any[] = []; // Declare the audioFileList property

audioFileList: NzUploadFile[] = []; 


// handleAudioFileChange(event: NzUploadChangeParam): void {
//   if (event.file.status === 'done') {
//     this.audioFileList = event.fileList; // Update the audioFileList with the newly uploaded files
//     // Additional logic to handle successful audio upload can be added here
//   } else if (event.file.status === 'error') {
//     // Handle error case
//     console.error('Audio upload failed:', event.file.response);
//   }
// }



// handleAudioFileChange(event: NzUploadChangeParam): void {
//   if (event.file.status === 'done' || event.file.status === 'uploading') {
//     const file = event.file.originFileObj as File;
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64Audio = reader.result as string;
//         this.editedNewsItem.audio_location = base64Audio; // Store the base64 string directly in audio_location
//       };
//       reader.readAsDataURL(file); // Convert to base64
//     }
//   } else if (event.file.status === 'error') {
//     console.error('Audio upload failed:', event.file.response);
//   }
// }



handleAudioFileChange(event: NzUploadChangeParam): void {
  if (event.file.status === 'done' || event.file.status === 'uploading') {
    const file = event.file.originFileObj as File;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Audio = reader.result as string;
        
        // Extract base64 part only (after the comma)
        const base64String = base64Audio.split(',')[1];
        
        this.editedNewsItem.audio_location = base64String; // Store only the base64 string
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  } else if (event.file.status === 'error') {
    console.error('Audio upload failed:', event.file.response);
  }
}

newsinformation:any;

fetchdata(): void {
  this.adminservice.fetchingnews().subscribe(
    data => {
      this.newsinformation = data;
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}






}
