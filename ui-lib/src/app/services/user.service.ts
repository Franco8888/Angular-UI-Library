import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { PromiseHelper } from '../helpers/promise';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  async getUsers(): Promise<User[]> {
    return Promise.resolve([
      { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=john' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=jane' },
      { name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=bob' },
      { name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=alice' },
      { name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=charlie' },
      { name: 'Diana Martinez', email: 'diana@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=diana' },
      { name: 'Edward Davis', email: 'edward@example.com', role: 'Editor', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=edward' },
      { name: 'Fiona Garcia', email: 'fiona@example.com', role: 'User', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=fiona' },
      { name: 'George Miller', email: 'george@example.com', role: 'Viewer', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=george' },
      { name: 'Hannah Rodriguez', email: 'hannah@example.com', role: 'User', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=hannah' },
      { name: 'Isaac Lee', email: 'isaac@example.com', role: 'Editor', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=isaac' },
      { name: 'Julia Wilson', email: 'julia@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=julia' },
      { name: 'Kevin Anderson', email: 'kevin@example.com', role: 'User', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=kevin' },
      { name: 'Laura Thomas', email: 'laura@example.com', role: 'Editor', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=laura' },
      { name: 'Michael Jackson', email: 'michael@example.com', role: 'Viewer', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=michael' },
      { name: 'Natalie White', email: 'natalie@example.com', role: 'User', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=natalie' },
      { name: 'Oliver Harris', email: 'oliver@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=oliver' },
      { name: 'Patricia Martin', email: 'patricia@example.com', role: 'Editor', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=patricia' },
      { name: 'Quinn Lewis', email: 'quinn@example.com', role: 'User', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=quinn' },
      { name: 'Rachel Clark', email: 'rachel@example.com', role: 'Viewer', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=rachel' },
      { name: 'Samuel Wright', email: 'samuel@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=samuel' },
      { name: 'Tiffany Young', email: 'tiffany@example.com', role: 'User', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=tiffany' },
      { name: 'Ulysses King', email: 'ulysses@example.com', role: 'Editor', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=ulysses' },
      { name: 'Victoria Scott', email: 'victoria@example.com', role: 'Viewer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=victoria' },
      { name: 'William Green', email: 'william@example.com', role: 'User', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=william' },
      { name: 'Xena Adams', email: 'xena@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=xena' },
      { name: 'Yolanda Baker', email: 'yolanda@example.com', role: 'Editor', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=yolanda' },
      { name: 'Zachary Nelson', email: 'zachary@example.com', role: 'User', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=zachary' },
      { name: 'Abigail Carter', email: 'abigail@example.com', role: 'Viewer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=abigail' },
      { name: 'Benjamin Hill', email: 'benjamin@example.com', role: 'Editor', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=benjamin' },
    ]);
  }

  async getUsersPaged(page: number, pageSize: number, searchColumn: keyof User | undefined, queryString: string | undefined): Promise<User[]> {
    console.log(searchColumn);
    console.log(queryString);
    await PromiseHelper.delay(500);
    const allUsers = await this.getUsers();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return Promise.resolve(allUsers.slice(startIndex, endIndex));
  }
}
