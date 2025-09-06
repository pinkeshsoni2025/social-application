import { Component, OnInit, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../models/publication';
import { UploadService } from '../../services/upload.service';
import { Identity } from '../../models/api-response';
import { environment } from '@/environments/environment';
import { Follow, Followed } from '../../models/follow';


@Component({
    selector: 'sidebar',
    standalone: true,
    providers: [UserService, PublicationService, UploadService, CommonModule, ReactiveFormsModule],

    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    private fb = inject(FormBuilder);
    public identity: Identity|null ={};
    public url!: string;
    public token;
    public stats!: any | null;
    public status: string | null = null;
    public publication: Publication;
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    addPublicationForm!: FormGroup;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private publicationService: PublicationService,
        private _uploadService: UploadService
    ) {
        this.url = environment.apiUrl;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = JSON.parse(this._userService.getStats() || '');
        this.publication = new Publication("", "", "", "", this.identity?._id || '');

        this.addPublicationForm = this.fb.group({
            text: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        console.log('[OK] Component: sidebar.');
        this.getCounter(this.identity?._id || null);
    }

    getCounter(id: string | null) {
        this._userService.getCounter(id).subscribe(
            (response: any) => {
                this.stats = response;
            },
            (error: any) => {
                console.log(<any>error);
            }
        );
    }

    addPublication() { debugger;
        if (this.addPublicationForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const text = this.addPublicationForm.get('text')?.value;
            

            this.publicationService.addPublication(this.token || '',{text}).subscribe({
                next: (response: { publication: { _id: string; }; }) => {
                    if (response.publication) {
                        //                    this.publication = response.publication;
                        // upload image
                        this.publication = { ...this.publication, ...response.publication };
                    } else {
                        this.status = 'error';
                    }
                },
                error: (error: any) => {
                    var errorMessage = <any>error;
                    console.log(errorMessage);

                    if (errorMessage != null) {
                        this.status = 'error';
                    }
                },
                complete: () => {
                    if (this.filesToUpload && this.filesToUpload.length) {
                        this._uploadService
                            .makeFileRequest(this.url + 'upload-image-pub/' + this.publication._id, [], this.filesToUpload, this.token || '', 'image')
                            .then((result: any) => {
                                this.publication.file = result.image;
                                this.status = 'success';
                                // form.reset();
                                this._router.navigate(['/timeline']);
                                this.sended.emit({ send: 'true' });
                            });
                    } else {
                        this.status = 'success';
                        // form.reset();
                        this._router.navigate(['/timeline']);
                        this.sended.emit({ send: 'true' });
                    }
                }
            });

            /* this.userService.updatePassword(this.addPublicationForm, {password:currentPassword, new_password:newPassword }).subscribe({
               next: () => {
                 this.successMessage = 'Password updated successfully';
                // this.toastService.success(this.successMessage,"Success");
                 this.addPublicationForm.reset();
               },
               error: (error) => {
                 this.errorMessage = error.error.message || 'Incorrect password';
                // this.toastService.error(this.errorMessage,"Error");
               },
               complete: () => {
                 this.isLoading = false;
               }
             });*/
        }
    }


    /* onSubmit(form: { reset: () => void; }, event: any) {
         this._publicationService.addPublication(this.token, this.publication).subscribe(
             ( response: { publication: { _id: string; }; }) => {
                 if (response.publication) {
 //                    this.publication = response.publication;
                     // upload image
                     if (this.filesToUpload && this.filesToUpload.length) {
                         this._uploadService
                             .makeFileRequest(this.url + 'upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
                             .then((result: any) => {
                                 this.publication.file = result.image;
                                 this.status = 'success';
                                 form.reset();
                                 this._router.navigate(['/timeline']);
                                 this.sended.emit({send:'true'});
                         });
                     } else {
                         this.status = 'success';
                         form.reset();
                         this._router.navigate(['/timeline']);
                         this.sended.emit({send:'true'});
                     }
                 } else {
                     this.status = 'error';
                 }
             },
             ( error: any) => {
                 var errorMessage = <any>error;
                 console.log(errorMessage);
 
                 if (errorMessage != null) {
                     this.status = 'error';
                 }
             }
         );
     }*/

    @Output() sended = new EventEmitter();

    sendPublication() {
        this.sended.emit({ send: 'true' });
    }

    public filesToUpload!: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
