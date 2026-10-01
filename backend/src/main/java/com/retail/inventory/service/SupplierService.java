package com.retail.inventory.service;

import com.retail.inventory.dto.SupplierRequest;
import com.retail.inventory.entity.Supplier;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAllByOrderByIdDesc();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier with ID " + id + " not found"));
    }

    @Transactional
    public Supplier createSupplier(SupplierRequest request) {
        if (supplierRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Supplier with email '" + request.getEmail() + "' already registered!");
        }

        Supplier supplier = Supplier.builder()
                .name(request.getName())
                .contactPerson(request.getContactPerson() != null ? request.getContactPerson() : "")
                .email(request.getEmail())
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .address(request.getAddress() != null ? request.getAddress() : "")
                .leadTimeDays(request.getLeadTimeDays() != null ? request.getLeadTimeDays() : 7)
                .build();

        return supplierRepository.save(supplier);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Supplier with ID " + id + " not found to delete");
        }
        supplierRepository.deleteById(id);
    }
}
